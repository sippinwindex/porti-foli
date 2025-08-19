// utils/date.ts - Complete date utilities
export type DateInput = string | number | Date

/**
 * Format a date to a readable string
 */
export const formatDate = (
  date: DateInput,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = new Date(date)
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * Format a date to a short string
 */
export const formatDateShort = (date: DateInput): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date to show only month and year
 */
export const formatMonthYear = (date: DateInput): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
  })
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (date: DateInput): string => {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000)
  
  const absSeconds = Math.abs(diffInSeconds)
  const isFuture = diffInSeconds > 0

  // Define time intervals
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(absSeconds / interval.seconds)
    if (count >= 1) {
      const unit = count === 1 ? interval.label : `${interval.label}s`
      return isFuture ? `in ${count} ${unit}` : `${count} ${unit} ago`
    }
  }

  return 'just now'
}

/**
 * Get time ago string (always past tense)
 */
export const timeAgo = (date: DateInput): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 0) return 'in the future'

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

/**
 * Check if a date is today
 */
export const isToday = (date: DateInput): boolean => {
  const today = new Date()
  const target = new Date(date)
  
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  )
}

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: DateInput): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const target = new Date(date)
  
  return (
    yesterday.getFullYear() === target.getFullYear() &&
    yesterday.getMonth() === target.getMonth() &&
    yesterday.getDate() === target.getDate()
  )
}

/**
 * Check if a date is this week
 */
export const isThisWeek = (date: DateInput): boolean => {
  const now = new Date()
  const target = new Date(date)
  
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  
  return target >= startOfWeek && target <= endOfWeek
}

/**
 * Check if a date is this month
 */
export const isThisMonth = (date: DateInput): boolean => {
  const now = new Date()
  const target = new Date(date)
  
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth()
  )
}

/**
 * Get the start of day
 */
export const startOfDay = (date: DateInput): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get the end of day
 */
export const endOfDay = (date: DateInput): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get the start of week (Sunday)
 */
export const startOfWeek = (date: DateInput): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day
  result.setDate(diff)
  return startOfDay(result)
}

/**
 * Get the end of week (Saturday)
 */
export const endOfWeek = (date: DateInput): Date => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  return endOfDay(result)
}

/**
 * Get the start of month
 */
export const startOfMonth = (date: DateInput): Date => {
  const result = new Date(date)
  result.setDate(1)
  return startOfDay(result)
}

/**
 * Get the end of month
 */
export const endOfMonth = (date: DateInput): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1, 0)
  return endOfDay(result)
}

/**
 * Add days to a date
 */
export const addDays = (date: DateInput, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add months to a date
 */
export const addMonths = (date: DateInput, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Add years to a date
 */
export const addYears = (date: DateInput, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * Get difference between two dates in days
 */
export const differenceInDays = (date1: DateInput, date2: DateInput): number => {
  const msPerDay = 1000 * 60 * 60 * 24
  const utc1 = Date.UTC(new Date(date1).getFullYear(), new Date(date1).getMonth(), new Date(date1).getDate())
  const utc2 = Date.UTC(new Date(date2).getFullYear(), new Date(date2).getMonth(), new Date(date2).getDate())
  
  return Math.floor((utc1 - utc2) / msPerDay)
}

/**
 * Get difference between two dates in hours
 */
export const differenceInHours = (date1: DateInput, date2: DateInput): number => {
  const msPerHour = 1000 * 60 * 60
  return Math.floor((new Date(date1).getTime() - new Date(date2).getTime()) / msPerHour)
}

/**
 * Get difference between two dates in minutes
 */
export const differenceInMinutes = (date1: DateInput, date2: DateInput): number => {
  const msPerMinute = 1000 * 60
  return Math.floor((new Date(date1).getTime() - new Date(date2).getTime()) / msPerMinute)
}

/**
 * Parse ISO date string safely
 */
export const parseISODate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Convert date to ISO string safely
 */
export const toISOString = (date: DateInput): string => {
  try {
    return new Date(date).toISOString()
  } catch {
    return new Date().toISOString()
  }
}

/**
 * Get Unix timestamp
 */
export const getUnixTimestamp = (date: DateInput = new Date()): number => {
  return Math.floor(new Date(date).getTime() / 1000)
}

/**
 * Convert Unix timestamp to Date
 */
export const fromUnixTimestamp = (timestamp: number): Date => {
  return new Date(timestamp * 1000)
}

/**
 * Format duration in human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

/**
 * Get business days between two dates (excluding weekends)
 */
export const getBusinessDays = (startDate: DateInput, endDate: DateInput): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let count = 0
  const current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Check if a year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Smart date formatting based on recency
 */
export const smartDateFormat = (date: DateInput): string => {
  if (isToday(date)) {
    return `Today at ${formatDate(date, { hour: 'numeric', minute: '2-digit' })}`
  } else if (isYesterday(date)) {
    return `Yesterday at ${formatDate(date, { hour: 'numeric', minute: '2-digit' })}`
  } else if (isThisWeek(date)) {
    return formatDate(date, { weekday: 'long', hour: 'numeric', minute: '2-digit' })
  } else if (isThisMonth(date)) {
    return formatDate(date, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  } else {
    return formatDateShort(date)
  }
}

export default {
  formatDate,
  formatDateShort,
  formatMonthYear,
  getRelativeTime,
  timeAgo,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addMonths,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  parseISODate,
  toISOString,
  getUnixTimestamp,
  fromUnixTimestamp,
  formatDuration,
  getBusinessDays,
  isLeapYear,
  getDaysInMonth,
  smartDateFormat,
}