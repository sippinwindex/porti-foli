// Minimal Location Hook - Prevents infinite loops
'use client'

import { useState, useEffect, useRef } from 'react'

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
}

export interface LocationState {
  data: LocationData | null
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

interface UseLocationOptions {
  enableCaching?: boolean
  cacheExpiry?: number
  onSuccess?: (data: LocationData) => void
  onError?: (error: string) => void
}

const CACHE_KEY = 'userLocationData'
const CACHE_VERSION = '3.0'
const DEFAULT_CACHE_EXPIRY = 30 * 60 * 1000 // 30 minutes

export const useUserLocation = (options: UseLocationOptions = {}): LocationState & {
  refetch: () => Promise<void>
  clearCache: () => void
} => {
  const {
    enableCaching = true,
    cacheExpiry = DEFAULT_CACHE_EXPIRY,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<LocationState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  // Prevent multiple simultaneous requests
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const clearCache = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch (error) {
        console.warn('Failed to clear cache:', error)
      }
    }
  }

  const getCachedData = (): LocationData | null => {
    if (!enableCaching || typeof localStorage === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const parsedCache = JSON.parse(cached)
      
      // Check version
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
      console.warn('Failed to parse cached data:', error)
      clearCache()
      return null
    }
  }

  const setCachedData = (data: LocationData) => {
    if (!enableCaching || typeof localStorage === 'undefined') return
    
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  const fetchLocation = async (): Promise<void> => {
    // Prevent multiple simultaneous requests
    if (fetchingRef.current || !mountedRef.current) return
    
    fetchingRef.current = true

    try {
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
        fetchingRef.current = false
        return
      }

      if (!mountedRef.current) {
        fetchingRef.current = false
        return
      }

      setState(prev => ({ ...prev, loading: true, error: null }))

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current

      console.log('Fetching location data (single attempt)')

      // Single fetch attempt with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      })
      
      const fetchPromise = fetch('https://ipapi.co/json/', { 
        signal,
        headers: { 'Accept': 'application/json' }
      })
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Location service error')
      }

      if (!mountedRef.current) {
        fetchingRef.current = false
        return
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
        ip: data.ip
      }
      
      // Cache and set state
      setCachedData(locationData)
      
      setState({
        data: locationData,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      })

      onSuccess?.(locationData)
      console.log('Location data fetched successfully:', locationData.city, locationData.country)
        
    } catch (error) {
      if (!mountedRef.current) {
        fetchingRef.current = false
        return
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch location'
      
      // Only log if not cancelled
      if (!errorMessage.includes('cancelled') && !errorMessage.includes('aborted')) {
        console.warn('Location fetch failed:', errorMessage)
      }
      
      // Try to use cached data if available
      const cachedData = getCachedData()
      if (cachedData) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }))
      } else {
        // Provide fallback data
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

    fetchingRef.current = false
  }

  const refetch = async (): Promise<void> => {
    if (fetchingRef.current) return
    
    clearCache()
    await fetchLocation()
  }

  // Single effect - runs only once on mount
  useEffect(() => {
    mountedRef.current = true
    fetchLocation()

    // Cleanup
    return () => {
      mountedRef.current = false
      fetchingRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, []) // Empty dependency array - runs only once!

  return {
    ...state,
    refetch,
    clearCache
  }
}

// Utility functions
export const getTimeGreeting = (timezone?: string): string => {
  try {
    const now = new Date()
    const hour = timezone 
      ? new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours()
      : now.getHours()
    
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 22) return 'Good evening'
    return 'Good evening'
  } catch (error) {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'Good morning'
    if (hour >= 12 && hour < 17) return 'Good afternoon'
    if (hour >= 17 && hour < 22) return 'Good evening'
    return 'Good evening'
  }
}

export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
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
    return '🌍'
  }
}

export default useUserLocation