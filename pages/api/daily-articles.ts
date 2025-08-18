// pages/api/daily-articles.ts (FIXED - moved from route.ts)
import type { NextApiRequest, NextApiResponse } from 'next'

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

const NEWS_API_KEY = process.env.NEWS_API_KEY

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('📰 Daily Articles API called')

  try {
    // If no NEWS_API_KEY, return sample articles
    if (!NEWS_API_KEY) {
      console.warn('⚠️ NEWS_API_KEY not configured - returning sample articles')
      return res.status(200).json({
        success: true,
        articles: getSampleArticles(),
        totalResults: 3,
        source: 'sample',
        timestamp: new Date().toISOString()
      })
    }

    const { 
      category = 'technology',
      pageSize = '10',
      page = '1'
    } = req.query

    // Fetch from NewsAPI with targeted tech queries
    const searchQueries = [
      '(artificial intelligence OR AI OR machine learning) AND (development OR programming)',
      '(React OR Next.js OR JavaScript OR TypeScript) AND (tutorial OR development)',
      '(full stack OR fullstack OR web development) AND (2024 OR 2025)'
    ]

    const articles: DailyArticle[] = []

    // Fetch articles for each category (limit API calls)
    for (let i = 0; i < Math.min(searchQueries.length, 3); i++) {
      try {
        const query = searchQueries[i]
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=popularity&pageSize=3&apiKey=${NEWS_API_KEY}`
        
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          
          const categoryArticles = data.articles
            ?.filter((article: NewsAPIArticle) => 
              article.title && 
              article.description && 
              article.url &&
              !article.title.includes('[Removed]')
            )
            .slice(0, 2) // Max 2 per category
            .map((article: NewsAPIArticle) => ({
              id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: cleanTitle(article.title),
              description: cleanDescription(article.description),
              url: article.url,
              source: article.source.name,
              publishedAt: article.publishedAt,
              imageUrl: article.urlToImage && isValidImageUrl(article.urlToImage) ? article.urlToImage : undefined,
              category: i === 0 ? 'AI' as const : i === 1 ? 'FullStack' as const : 'LLM' as const,
              readTime: estimateReadTime(article.description)
            })) || []

          articles.push(...categoryArticles)
        }
      } catch (err) {
        console.warn(`Failed to fetch articles for query ${i}:`, err)
      }
    }

    // If we got articles, return them
    if (articles.length > 0) {
      const sortedArticles = articles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6) // Max 6 articles total

      return res.status(200).json({
        success: true,
        articles: sortedArticles,
        totalResults: sortedArticles.length,
        source: 'newsapi',
        timestamp: new Date().toISOString(),
        requestsUsed: 3
      })
    }

    // Fallback to sample articles
    return res.status(200).json({
      success: true,
      articles: getSampleArticles(),
      totalResults: 3,
      source: 'fallback',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Daily articles API error:', error)
    
    // Always return some articles, even on error
    return res.status(200).json({
      success: true,
      articles: getSampleArticles(),
      totalResults: 3,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

// Helper functions
function getSampleArticles(): DailyArticle[] {
  return [
    {
      id: 'sample-1',
      title: "The Future of Web Development in 2025",
      description: "Exploring the latest trends and technologies shaping modern web development, including AI integration and performance optimization.",
      url: "https://example.com/web-development-2025",
      source: "Tech News Daily",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
      category: "FullStack",
      readTime: "5 min read"
    },
    {
      id: 'sample-2',
      title: "React 19: New Features and Performance Improvements",
      description: "A comprehensive look at React 19's new features, including improved server components and enhanced performance optimizations.",
      url: "https://example.com/react-19-features",
      source: "React Community",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      category: "FullStack",
      readTime: "7 min read"
    },
    {
      id: 'sample-3',
      title: "AI-Powered Development Tools: Revolutionizing Coding",
      description: "How artificial intelligence is transforming the way developers write, test, and deploy code in modern software development.",
      url: "https://example.com/ai-development-tools",
      source: "Developer Weekly",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      category: "AI",
      readTime: "6 min read"
    }
  ]
}

function cleanTitle(title: string): string {
  return title.replace(/ - [^-]+$/, '').trim()
}

function cleanDescription(description: string): string {
  if (description.length > 200) {
    return description.substring(0, 200).trim() + '...'
  }
  return description.trim()
}

function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(' ').length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}

function isValidImageUrl(url: string): boolean {
  try {
    new URL(url)
    return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp')
  } catch {
    return false
  }
}