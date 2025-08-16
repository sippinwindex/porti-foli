// app/api/daily-articles/route.ts
import { NextResponse } from 'next/server'

interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
}

interface DailyArticle {
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

class DailyArticlesFetcher {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

  // Targeted search queries for each category (only 3 API calls total)
  private readonly SEARCH_QUERIES = [
    {
      query: '(artificial intelligence OR AI OR machine learning) AND (development OR programming OR coding)',
      category: 'AI' as const,
      maxResults: 2
    },
    {
      query: '(LLM OR "large language model" OR GPT OR "language model") AND (development OR programming)',
      category: 'LLM' as const,
      maxResults: 2
    },
    {
      query: '("full stack" OR fullstack OR "web development" OR React OR Node.js) AND (tutorial OR guide OR tips)',
      category: 'FullStack' as const,
      maxResults: 2
    }
  ]

  async fetchCategoryArticles(query: string, category: 'AI' | 'LLM' | 'FullStack', maxResults: number): Promise<DailyArticle[]> {
    if (!this.NEWS_API_KEY) {
      console.warn('NEWS_API_KEY not found')
      return []
    }

    try {
      // Get yesterday's date to today for recent articles
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const fromDate = yesterday.toISOString().split('T')[0]

      const url = new URL('https://newsapi.org/v2/everything')
      url.searchParams.set('q', query)
      url.searchParams.set('language', 'en')
      url.searchParams.set('sortBy', 'popularity') // Get most engaging content
      url.searchParams.set('from', fromDate)
      url.searchParams.set('pageSize', '10') // Get 10 to filter down to best 2
      url.searchParams.set('domains', 'techcrunch.com,arstechnica.com,theverge.com,wired.com,medium.com,dev.to,hackernoon.com') // Quality tech sources

      const response = await fetch(url.toString(), {
        headers: {
          'X-API-Key': this.NEWS_API_KEY
        },
        next: { revalidate: this.CACHE_DURATION / 1000 } // Next.js cache for 6 hours
      })

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.articles || data.articles.length === 0) {
        return []
      }

      // Filter and transform articles
      const articles: DailyArticle[] = data.articles
        .filter((article: NewsAPIArticle) => 
          article.title && 
          article.description && 
          article.url &&
          !article.title.includes('[Removed]') &&
          article.description.length > 50 &&
          this.isRelevantToCategory(article, category)
        )
        .slice(0, maxResults) // Take only the best ones
        .map((article: NewsAPIArticle) => ({
          id: `${category.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: this.cleanTitle(article.title),
          description: this.cleanDescription(article.description),
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage && this.isValidImageUrl(article.urlToImage) ? article.urlToImage : undefined,
          category,
          readTime: this.estimateReadTime(article.description)
        }))

      return articles
    } catch (error) {
      console.error(`Error fetching ${category} articles:`, error)
      return []
    }
  }

  async fetchAllDailyArticles(): Promise<DailyArticle[]> {
    try {
      // Execute all 3 API calls in parallel (uses only 3 of our 100 daily requests)
      const articlePromises = this.SEARCH_QUERIES.map(({ query, category, maxResults }) =>
        this.fetchCategoryArticles(query, category, maxResults)
      )

      const articleArrays = await Promise.all(articlePromises)
      const allArticles = articleArrays.flat()

      // Sort by publication date (newest first) and ensure we have 3-5 articles
      const sortedArticles = allArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 5) // Maximum 5 articles

      return sortedArticles
    } catch (error) {
      console.error('Error fetching daily articles:', error)
      return []
    }
  }

  // Helper methods
  private isRelevantToCategory(article: NewsAPIArticle, category: 'AI' | 'LLM' | 'FullStack'): boolean {
    const content = (article.title + ' ' + article.description).toLowerCase()
    
    const categoryKeywords = {
      AI: ['artificial intelligence', 'ai', 'machine learning', 'neural network', 'deep learning', 'computer vision', 'nlp'],
      LLM: ['llm', 'large language model', 'gpt', 'bert', 'transformer', 'language model', 'chatgpt', 'openai'],
      FullStack: ['full stack', 'fullstack', 'web development', 'react', 'node.js', 'javascript', 'typescript', 'frontend', 'backend', 'database']
    }

    const keywords = categoryKeywords[category]
    return keywords.some(keyword => content.includes(keyword))
  }

  private cleanTitle(title: string): string {
    // Remove source attribution from title
    return title.replace(/ - [^-]+$/, '').trim()
  }

  private cleanDescription(description: string): string {
    // Truncate description if too long and clean up
    if (description.length > 200) {
      return description.substring(0, 200).trim() + '...'
    }
    return description.trim()
  }

  private estimateReadTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url)
      return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp')
    } catch {
      return false
    }
  }
}

// API Route Handler
export async function GET() {
  const fetcher = new DailyArticlesFetcher()
  
  try {
    const articles = await fetcher.fetchAllDailyArticles()
    
    // Add some fallback content if no articles found
    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        articles: [], // Will trigger the "no articles" state in frontend
        timestamp: new Date().toISOString(),
        message: 'No articles found - this might be due to API limits or no new content today'
      })
    }

    return NextResponse.json({
      success: true,
      articles,
      timestamp: new Date().toISOString(),
      requestsUsed: 3, // We used 3 API requests
      remainingToday: 97 // Assuming we started with 100
    })
  } catch (error) {
    console.error('Daily articles API error:', error)
    
    return NextResponse.json({
      success: false,
      articles: [],
      error: 'Failed to fetch articles',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Cache the response for 6 hours
export const revalidate = 21600