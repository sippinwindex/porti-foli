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
const CACHE_VERSION = '2.0' // Bumped version for cache invalidation
const DEFAULT_CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour
const DEFAULT_RETRY_ATTEMPTS = 2 // Reduced from 3
const DEFAULT_RETRY_DELAY = 2000 // Increased delay

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

  // Use refs to prevent memory leaks
  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  // Cleanup function
  const cleanup = useCallback(() => {
    mountedRef.current = false
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const clearCache = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch (error) {
        console.warn('Failed to clear location cache:', error)
      }
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
      }, 8000) // Reduced timeout

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
          timeout: 6000,
          maximumAge: 600000 // 10 minutes - increased cache time
        }
      )
    })
  }, [])

  const fetchLocationWithRetry = useCallback(async (attempt = 1): Promise<LocationData> => {
    // Check if component is still mounted
    if (!mountedRef.current) {
      throw new Error('Component unmounted')
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    try {
      console.log(`Fetching location data (attempt ${attempt})`)
      
      // Try ipapi.co with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      })
      
      const fetchPromise = fetch('https://ipapi.co/json/', { 
        signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Location service error')
      }
      
      const locationData: LocationData = {
        country: data.country_name || 'Unknown',
        countryCode: data.country_code || 'XX',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        isp: data.org || 'Unknown ISP',
        currency: data.currency || 'USD',
        languages: data.languages ? data.languages.split(',') : ['en'],
        ip: data.ip,
        asn: data.asn,
        postal: data.postal
      }
      
      console.log('Location data fetched successfully:', locationData.city, locationData.country)
      return locationData
      
    } catch (error) {
      if (signal.aborted || !mountedRef.current) {
        throw new Error('Request was cancelled')
      }

      console.warn(`Location fetch attempt ${attempt} failed:`, error)

      // Try fallback services only on first attempt
      if (attempt === 1) {
        try {
          const fallbackResponse = await fetch('https://api.ipify.org?format=json', { 
            signal,
            headers: { 'Accept': 'application/json' }
          })
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            
            return {
              country: 'Unknown',
              countryCode: 'XX',
              region: 'Unknown',
              city: 'Unknown',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              latitude: 0,
              longitude: 0,
              isp: 'Unknown',
              currency: 'USD',
              languages: [navigator.language?.split('-')[0] || 'en'],
              ip: fallbackData.ip
            }
          }
        } catch (fallbackError) {
          console.warn('Fallback service also failed:', fallbackError)
        }
      }

      // Retry logic with exponential backoff
      if (attempt < retryAttempts && mountedRef.current) {
        const delay = retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
        return fetchLocationWithRetry(attempt + 1)
      }

      throw error
    }
  }, [retryAttempts, retryDelay])

  const fetchLocation = useCallback(async (): Promise<void> => {
    if (!mountedRef.current) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      retryCountRef.current = 0

      // Check cache first
      const cachedData = getCachedData()
      if (cachedData && mountedRef.current) {
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

      if (!mountedRef.current) return

      // Try to enhance with navigator API if coordinates are missing
      if (fallbackToNavigatorAPI && locationData.latitude === 0 && locationData.longitude === 0) {
        try {
          const coords = await getNavigatorLocation()
          if (mountedRef.current) {
            locationData.latitude = coords.latitude
            locationData.longitude = coords.longitude
          }
        } catch (navError) {
          console.info('Navigator geolocation not available:', navError)
        }
      }

      if (!mountedRef.current) return

      // Cache the successful result
      setCachedData(locationData)
      
      setState({
        data: locationData,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      })

      onSuccess?.(locationData)
        
    } catch (error) {
      if (!mountedRef.current) return

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch location'
      console.warn('Location fetch failed:', errorMessage)
      
      // Use cached data if available, otherwise fallback
      const cachedData = getCachedData()
      if (cachedData) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }))
      } else {
        // Provide generic fallback
        const fallbackData: LocationData = {
          country: 'Earth',
          countryCode: 'XX',
          region: 'Internet',
          city: 'Digital Space',
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
    if (!mountedRef.current) return
    
    clearCache()
    await fetchLocation()
  }, [clearCache, fetchLocation])

  // Main effect with proper cleanup
  useEffect(() => {
    mountedRef.current = true
    fetchLocation()

    // Cleanup function
    return () => {
      cleanup()
    }
  }, [fetchLocation, cleanup])

  return {
    ...state,
    refetch,
    clearCache
  }
}

// Utility functions with better error handling
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
  } catch (error) {
    console.warn('Error getting time greeting:', error)
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
  } catch (error) {
    console.warn('Error getting timezone time:', error)
    return new Date().toLocaleTimeString('en-US', defaultOptions)
  }
}

export const getCountryFlag = (countryCode: string): string => {
  try {
    const code = countryCode.toUpperCase()
    if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) return '🌍'
    
    const offset = 127397
    return String.fromCodePoint(
      code.charCodeAt(0) + offset,
      code.charCodeAt(1) + offset
    )
  } catch (error) {
    console.warn('Error getting country flag:', error)
    return '🌍'
  }
}

export const getRelativeDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  try {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  } catch (error) {
    console.warn('Error calculating distance:', error)
    return 0
  }
}

export const isLocationDataStale = (lastUpdated: number | null, maxAge = DEFAULT_CACHE_EXPIRY): boolean => {
  if (!lastUpdated) return true
  return Date.now() - lastUpdated > maxAge
}

export default useUserLocation