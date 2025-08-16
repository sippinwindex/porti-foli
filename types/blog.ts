// types/blog.ts
// Shared types for blog functionality

export interface TechArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  tags: string[]
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
}

export interface DailyArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: 'AI' | 'LLM' | 'FullStack'
  readTime?: string
}

export interface TrendingTopic {
  name: string
  volume?: number
  category: 'AI' | 'LLM' | 'FullStack' | 'WebDev' | 'Tech'
  description?: string
}

export interface BlogContentResponse {
  success: boolean
  articles: DailyArticle[]
  timestamp: string
  requestsUsed?: number
  remainingToday?: number
  error?: string
  message?: string
}

// NewsAPI types
export interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
}

export interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

// Hacker News types
export interface HackerNewsItem {
  id: number
  title: string
  url?: string
  score: number
  descendants: number
  time: number
  by: string
  type: string
}

// Dev.to types
export interface DevToArticle {
  id: number
  title: string
  description: string
  url: string
  cover_image: string
  published_at: string
  user: { name: string }
  positive_reactions_count: number
  comments_count: number
  tag_list: string[]
}