// hooks/useUserLocation.ts
'use client'

import { useState, useEffect } from 'react'

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
}

export interface LocationState {
  data: LocationData | null
  loading: boolean
  error: string | null
}

export const useUserLocation = (): LocationState => {
  const [state, setState] = useState<LocationState>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Check if we have cached location data (valid for 1 hour)
        const cachedData = localStorage.getItem('userLocationData')
        const cachedTimestamp = localStorage.getItem('userLocationTimestamp')
        const oneHour = 60 * 60 * 1000

        if (cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp)
          if (age < oneHour) {
            setState({
              data: JSON.parse(cachedData),
              loading: false,
              error: null
            })
            return
          }
        }

        // Fetch fresh location data
        const response = await fetch('https://ipapi.co/json/')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()

        // Handle API errors
        if (data.error) {
          throw new Error(data.reason || 'Location service error')
        }
        
        const locationData: LocationData = {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          isp: data.org || 'Unknown ISP',
          currency: data.currency || 'USD',
          languages: data.languages ? data.languages.split(',') : ['en']
        }

        // Cache the data
        localStorage.setItem('userLocationData', JSON.stringify(locationData))
        localStorage.setItem('userLocationTimestamp', Date.now().toString())
        
        setState({
          data: locationData,
          loading: false,
          error: null
        })
        
      } catch (error) {
        console.warn('Could not fetch location data:', error)
        
        // Fallback to a generic location
        const fallbackData: LocationData = {
          country: 'Earth',
          countryCode: 'XX',
          region: 'Internet',
          city: 'Somewhere',
          timezone: 'UTC',
          latitude: 0,
          longitude: 0,
          isp: 'Unknown',
          currency: 'USD',
          languages: ['en']
        }
        
        setState({
          data: fallbackData,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch location'
        })
      }
    }

    fetchLocation()
  }, [])

  return state
}

// Utility functions for working with location data
export const getTimeGreeting = (timezone?: string): string => {
  try {
    const now = new Date()
    const hour = timezone 
      ? new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours()
      : now.getHours()
    
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  } catch {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
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
  } catch {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

export const getCountryFlag = (countryCode: string): string => {
  // Convert country code to flag emoji
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'CA': '🇨🇦', 'GB': '🇬🇧', 'AU': '🇦🇺',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'BR': '🇧🇷',
    'IN': '🇮🇳', 'MX': '🇲🇽', 'ES': '🇪🇸', 'IT': '🇮🇹',
    'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰',
    'FI': '🇫🇮', 'CH': '🇨🇭', 'AT': '🇦🇹', 'BE': '🇧🇪',
    'IE': '🇮🇪', 'PT': '🇵🇹', 'PL': '🇵🇱', 'CZ': '🇨🇿',
    'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷',
    'SI': '🇸🇮', 'SK': '🇸🇰', 'LT': '🇱🇹', 'LV': '🇱🇻',
    'EE': '🇪🇪', 'GR': '🇬🇷', 'CY': '🇨🇾', 'MT': '🇲🇹',
    'LU': '🇱🇺', 'IS': '🇮🇸', 'KR': '🇰🇷', 'CN': '🇨🇳',
    'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳',
    'ID': '🇮🇩', 'PH': '🇵🇭', 'TW': '🇹🇼', 'HK': '🇭🇰',
    'NZ': '🇳🇿', 'ZA': '🇿🇦', 'AR': '🇦🇷', 'CL': '🇨🇱',
    'CO': '🇨🇴', 'PE': '🇵🇪', 'UY': '🇺🇾', 'EC': '🇪🇨',
    'BO': '🇧🇴', 'PY': '🇵🇾', 'VE': '🇻🇪', 'GY': '🇬🇾',
    'SR': '🇸🇷', 'FK': '🇫🇰', 'IL': '🇮🇱', 'TR': '🇹🇷',
    'RU': '🇷🇺', 'UA': '🇺🇦', 'BY': '🇧🇾', 'MD': '🇲🇩'
  }
  
  return flags[countryCode.toUpperCase()] || '🌍'
}

export default useUserLocation