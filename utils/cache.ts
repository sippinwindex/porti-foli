// utils/cache.ts - Complete caching utilities with proper React import
import React from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  prefix?: string
  serialize?: boolean
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes
  private prefix = 'portfolio_cache_'

  /**
   * Set an item in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.defaultTTL,
      prefix = this.prefix,
      serialize = false
    } = options

    const cacheKey = `${prefix}${key}`
    const entry: CacheEntry<T> = {
      data: serialize ? JSON.parse(JSON.stringify(data)) : data,
      timestamp: Date.now(),
      ttl
    }

    this.cache.set(cacheKey, entry)

    // Also store in localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: serialize ? data : JSON.stringify(data),
          timestamp: entry.timestamp,
          ttl: entry.ttl
        }))
      } catch (error) {
        console.warn('Failed to store in localStorage:', error)
      }
    }
  }

  /**
   * Get an item from cache
   */
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const {
      prefix = this.prefix
    } = options

    const cacheKey = `${prefix}${key}`
    
    // Try memory cache first
    let entry = this.cache.get(cacheKey)

    // If not in memory, try localStorage
    if (!entry && typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(cacheKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          entry = {
            data: typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data,
            timestamp: parsed.timestamp,
            ttl: parsed.ttl
          }
          // Restore to memory cache
          this.cache.set(cacheKey, entry)
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
      }
    }

    if (!entry) return null

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.delete(key, options)
      return null
    }

    return entry.data
  }

  /**
   * Check if an item exists and is not expired
   */
  has(key: string, options: CacheOptions = {}): boolean {
    return this.get(key, options) !== null
  }

  /**
   * Delete an item from cache
   */
  delete(key: string, options: CacheOptions = {}): boolean {
    const {
      prefix = this.prefix
    } = options

    const cacheKey = `${prefix}${key}`
    
    // Remove from memory
    const memoryDeleted = this.cache.delete(cacheKey)
    
    // Remove from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(cacheKey)
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error)
      }
    }

    return memoryDeleted
  }

  /**
   * Clear all cache entries with the given prefix
   */
  clear(prefix?: string): void {
    const targetPrefix = prefix || this.prefix

    // Clear memory cache
    for (const key of this.cache.keys()) {
      if (key.startsWith(targetPrefix)) {
        this.cache.delete(key)
      }
    }

    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith(targetPrefix)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(prefix?: string): {
    size: number
    keys: string[]
    totalSize: number
  } {
    const targetPrefix = prefix || this.prefix
    const keys = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(targetPrefix)
    )

    let totalSize = 0
    keys.forEach(key => {
      const entry = this.cache.get(key)
      if (entry) {
        totalSize += JSON.stringify(entry).length
      }
    })

    return {
      size: keys.length,
      keys: keys.map(key => key.replace(targetPrefix, '')),
      totalSize
    }
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now()
    let removedCount = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        removedCount++
      }
    }

    return removedCount
  }
}

// Create singleton instance
const cache = new Cache()

// Export convenient wrapper functions
export const setCache = <T>(key: string, data: T, ttl?: number): void => {
  cache.set(key, data, { ttl })
}

export const getCache = <T>(key: string): T | null => {
  return cache.get<T>(key)
}

export const hasCache = (key: string): boolean => {
  return cache.has(key)
}

export const deleteCache = (key: string): boolean => {
  return cache.delete(key)
}

export const clearCache = (prefix?: string): void => {
  cache.clear(prefix)
}

export const getCacheStats = () => cache.getStats()

export const cleanupCache = () => cache.cleanup()

// Automatic cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const removed = cleanupCache()
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired cache entries`)
    }
  }, 10 * 60 * 1000)
}

// Export the cache instance for advanced usage
export { cache }

// Hook for React components with proper dependencies
export const useCache = <T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl: number = 5 * 60 * 1000
) => {
  const [data, setData] = React.useState<T | null>(getCache<T>(key))
  const [loading, setLoading] = React.useState(!hasCache(key))
  const [error, setError] = React.useState<string | null>(null)

  // FIXED: Memoize fetchData to prevent recreation
  const fetchData = React.useCallback(async () => {
    if (hasCache(key)) {
      const cached = getCache<T>(key)
      if (cached !== null) {
        setData(cached)
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      const result = await fetcher()
      setCache(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl]) // FIXED: Include all dependencies

  // FIXED: Effect with proper dependency
  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default cache