// hooks/useUserLocation.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  timezone: string
  latitude: number
  longitude: number
  isp: string
  currency?: string
  languages?: string[]
  ip?: string
  asn?: string
  postal?: string
}

export interface LocationState {
  data: LocationData | null
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

interface LocationCache {
  data: LocationData
  timestamp: number
  version: string
}

interface UseLocationOptions {
  enableCaching?: boolean
  cacheExpiry?: number // in milliseconds
  fallbackToNavigatorAPI?: boolean
  retryAttempts?: number
  retryDelay?: number
  onSuccess?: (data: LocationData) => void
  onError?: (error: string) => void
}

const CACHE_KEY = 'userLocationData'
const CACHE_VERSION = '1.0'
const DEFAULT_CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour
const DEFAULT_RETRY_ATTEMPTS = 3
const DEFAULT_RETRY_DELAY = 1000

export const useUserLocation = (options: UseLocationOptions = {}): LocationState & {
  refetch: () => Promise<void>
  clearCache: () => void
} => {
  const {
    enableCaching = true,
    cacheExpiry = DEFAULT_CACHE_EXPIRY,
    fallbackToNavigatorAPI = true,
    retryAttempts = DEFAULT_RETRY_ATTEMPTS,
    retryDelay = DEFAULT_RETRY_DELAY,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<LocationState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  const clearCache = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(CACHE_KEY)
    }
  }, [])

  const getCachedData = useCallback((): LocationData | null => {
    if (!enableCaching || typeof localStorage === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const parsedCache: LocationCache = JSON.parse(cached)
      
      // Check version compatibility
      if (parsedCache.version !== CACHE_VERSION) {
        clearCache()
        return null
      }

      // Check if cache is still valid
      const age = Date.now() - parsedCache.timestamp
      if (age >= cacheExpiry) {
        clearCache()
        return null
      }

      return parsedCache.data
    } catch (error) {
      console.warn('Failed to parse cached location data:', error)
      clearCache()
      return null
    }
  }, [enableCaching, cacheExpiry, clearCache])

  const setCachedData = useCallback((data: LocationData) => {
    if (!enableCaching || typeof localStorage === 'undefined') return
    
    try {
      const cacheData: LocationCache = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to cache location data:', error)
    }
  }, [enableCaching])

  const getNavigatorLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Geolocation timeout'))
      }, 10000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          clearTimeout(timeoutId)
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }, [])

  const fetchLocationWithRetry = useCallback(async (attempt = 1): Promise<LocationData> => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    try {
      // Try ipapi.co first
      const response = await fetch('https://ipapi.co/json/', { 
        signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Portfolio-Location-Hook/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Location service error')
      }
      
      return {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'UTC',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        isp: data.org || 'Unknown ISP',
        currency: data.currency || 'USD',
        languages: data.languages ? data.languages.split(',') : ['en'],
        ip: data.ip,
        asn: data.asn,
        postal: data.postal
      }
      
    } catch (error) {
      if (signal.aborted) {
        throw new Error('Request was cancelled')
      }

      // Try fallback services
      if (attempt === 1) {
        try {
          const fallbackResponse = await fetch('https://api.ipify.org?format=json', { signal })
          const fallbackData = await fallbackResponse.json()
          
          // Basic fallback data
          return {
            country: 'Unknown',
            countryCode: 'XX',
            region: 'Unknown',
            city: 'Unknown',
            timezone: 'UTC',
            latitude: 0,
            longitude: 0,
            isp: 'Unknown',
            currency: 'USD',
            languages: ['en'],
            ip: fallbackData.ip
          }
        } catch (fallbackError) {
          // Continue to retry logic
        }
      }

      // Retry logic
      if (attempt < retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
        return fetchLocationWithRetry(attempt + 1)
      }

      throw error
    }
  }, [retryAttempts, retryDelay])

  const fetchLocation = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      retryCountRef.current = 0

      // Check cache first
      const cachedData = getCachedData()
      if (cachedData) {
        setState({
          data: cachedData,
          loading: false,
          error: null,
          lastUpdated: Date.now()
        })
        onSuccess?.(cachedData)
        return
      }

      // Fetch fresh data
      const locationData = await fetchLocationWithRetry()

      // Try to enhance with navigator API if available and permitted
      if (fallbackToNavigatorAPI && locationData.latitude === 0 && locationData.longitude === 0) {
        try {
          const coords = await getNavigatorLocation()
          locationData.latitude = coords.latitude
          locationData.longitude = coords.longitude
        } catch (navError) {
          console.info('Navigator geolocation not available or denied:', navError)
        }
      }

      // Cache the successful result
      setCachedData(locationData)
      
      const now = Date.now()
      setState({
        data: locationData,
        loading: false,
        error: null,
        lastUpdated: now
      })

      onSuccess?.(locationData)
        
    } catch (error) {
      console.warn('Could not fetch location data:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch location'
      
      // Fallback to generic location only if no cached data exists
      const cachedData = getCachedData()
      if (!cachedData) {
        const fallbackData: LocationData = {
          country: 'Earth',
          countryCode: 'XX',
          region: 'Internet',
          city: 'Somewhere',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          latitude: 0,
          longitude: 0,
          isp: 'Unknown',
          currency: 'USD',
          languages: [navigator.language?.split('-')[0] || 'en']
        }
        
        setState({
          data: fallbackData,
          loading: false,
          error: errorMessage,
          lastUpdated: Date.now()
        })
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }))
      }

      onError?.(errorMessage)
    }
  }, [
    getCachedData, 
    setCachedData, 
    fetchLocationWithRetry, 
    fallbackToNavigatorAPI, 
    getNavigatorLocation,
    onSuccess, 
    onError
  ])

  const refetch = useCallback(async (): Promise<void> => {
    clearCache()
    await fetchLocation()
  }, [clearCache, fetchLocation])

  useEffect(() => {
    fetchLocation()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchLocation])

  return {
    ...state,
    refetch,
    clearCache
  }
}

// Enhanced utility functions
export const getTimeGreeting = (timezone?: string, customGreetings?: {
  morning?: string
  afternoon?: string
  evening?: string
  night?: string
}): string => {
  const greetings = {
    morning: customGreetings?.morning || 'Good morning',
    afternoon: customGreetings?.afternoon || 'Good afternoon', 
    evening: customGreetings?.evening || 'Good evening',
    night: customGreetings?.night || 'Good evening'
  }

  try {
    const now = new Date()
    const hour = timezone 
      ? new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours()
      : now.getHours()
    
    if (hour >= 5 && hour < 12) return greetings.morning
    if (hour >= 12 && hour < 17) return greetings.afternoon
    if (hour >= 17 && hour < 22) return greetings.evening
    return greetings.night
  } catch {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return greetings.morning
    if (hour >= 12 && hour < 17) return greetings.afternoon
    if (hour >= 17 && hour < 22) return greetings.evening
    return greetings.night
  }
}

export const getCurrentTimeInTimezone = (
  timezone: string, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  }

  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      ...defaultOptions
    })
  } catch {
    return new Date().toLocaleTimeString('en-US', defaultOptions)
  }
}

export const getCountryFlag = (countryCode: string): string => {
  try {
    // Convert country code to flag emoji using Unicode regional indicator symbols
    const code = countryCode.toUpperCase()
    if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) return '🌍'
    
    const offset = 127397 // Offset for regional indicator symbols
    return String.fromCodePoint(
      code.charCodeAt(0) + offset,
      code.charCodeAt(1) + offset
    )
  } catch {
    return '🌍'
  }
}

export const getRelativeDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const isLocationDataStale = (lastUpdated: number | null, maxAge = DEFAULT_CACHE_EXPIRY): boolean => {
  if (!lastUpdated) return true
  return Date.now() - lastUpdated > maxAge
}

export default useUserLocation