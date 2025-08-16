// lib/blog-content-fetcher.ts
// Fixed version with proper type definitions

// Type definitions
interface TechArticle {
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

interface TrendingTopic {
  name: string
  volume?: number
  category: 'AI' | 'LLM' | 'FullStack' | 'WebDev' | 'Tech'
  description?: string
}

interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
}

interface HackerNewsItem {
  id: number
  title: string
  url?: string
  score: number
  descendants: number
  time: number
  by: string
}

interface DevToArticle {
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

export class BlogContentFetcher {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY
  private readonly X_BEARER_TOKEN = process.env.X_BEARER_TOKEN

  // Fetch from NewsAPI (free tier: 100 requests/day)
  async fetchNewsAPIContent(): Promise<TechArticle[]> {
    if (!this.NEWS_API_KEY) return []

    try {
      const queries = [
        'AI artificial intelligence',
        'machine learning LLM',
        'React Next.js',
        'full stack development',
        'TypeScript JavaScript'
      ]

      const articles: TechArticle[] = []

      for (const query of queries) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=5`,
          {
            headers: { 'X-API-Key': this.NEWS_API_KEY },
            next: { revalidate: 3600 } // Cache for 1 hour
          }
        )

        if (response.ok) {
          const data = await response.json()
          const newsArticles = data.articles?.slice(0, 2).map((article: NewsAPIArticle) => ({
            id: `news-${Date.now()}-${Math.random()}`,
            title: article.title,
            description: article.description || '',
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage,
            tags: this.extractTags(article.title + ' ' + article.description, query),
            engagement: {
              likes: Math.floor(Math.random() * 500) + 50,
              shares: Math.floor(Math.random() * 100) + 10,
              comments: Math.floor(Math.random() * 50) + 5
            }
          })) || []

          articles.push(...newsArticles)
        }
      }

      return articles.slice(0, 10) // Limit to 10 articles
    } catch (error) {
      console.error('NewsAPI fetch error:', error)
      return []
    }
  }

  // Fetch from Hacker News (free)
  async fetchHackerNewsContent(): Promise<TechArticle[]> {
    try {
      // Get top stories
      const topStoriesResponse = await fetch(
        'https://hacker-news.firebaseio.com/v0/topstories.json',
        { next: { revalidate: 1800 } } // Cache for 30 minutes
      )
      
      if (!topStoriesResponse.ok) return []

      const topStoryIds = await topStoriesResponse.json()
      const selectedIds = topStoryIds.slice(0, 15) // Get first 15 stories

      const articles: TechArticle[] = []

      for (const id of selectedIds) {
        try {
          const itemResponse = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { next: { revalidate: 1800 } }
          )

          if (itemResponse.ok) {
            const item: HackerNewsItem = await itemResponse.json()
            
            // Filter for tech-related content
            if (item.url && this.isTechRelated(item.title)) {
              articles.push({
                id: `hn-${item.id}`,
                title: item.title,
                description: `Hacker News discussion with ${item.score} points and ${item.descendants || 0} comments`,
                url: item.url,
                source: 'Hacker News',
                publishedAt: new Date(item.time * 1000).toISOString(),
                tags: this.extractTags(item.title, 'tech'),
                engagement: {
                  likes: item.score,
                  shares: Math.floor(item.score / 10),
                  comments: item.descendants || 0
                }
              })
            }
          }
        } catch (itemError) {
          console.error(`Error fetching HN item ${id}:`, itemError)
        }
      }

      return articles.slice(0, 8) // Limit to 8 articles
    } catch (error) {
      console.error('Hacker News fetch error:', error)
      return []
    }
  }

  // Fetch from Dev.to (free)
  async fetchDevToContent(): Promise<TechArticle[]> {
    try {
      const tags = ['ai', 'react', 'javascript', 'typescript', 'fullstack', 'machinelearning']
      const articles: TechArticle[] = []

      for (const tag of tags) {
        const response = await fetch(
          `https://dev.to/api/articles?tag=${tag}&top=7&per_page=3`,
          { next: { revalidate: 3600 } }
        )

        if (response.ok) {
          const devToArticles: DevToArticle[] = await response.json()
          
          const processedArticles = devToArticles.map(article => ({
            id: `devto-${article.id}`,
            title: article.title,
            description: article.description || '',
            url: article.url,
            source: 'Dev.to',
            publishedAt: article.published_at,
            imageUrl: article.cover_image,
            tags: article.tag_list || [tag],
            engagement: {
              likes: article.positive_reactions_count,
              shares: Math.floor(article.positive_reactions_count / 5),
              comments: article.comments_count
            }
          }))

          articles.push(...processedArticles)
        }
      }

      return articles.slice(0, 12) // Limit to 12 articles
    } catch (error) {
      console.error('Dev.to fetch error:', error)
      return []
    }
  }

  // Fetch trending from GitHub (free)
  async fetchGitHubTrending(): Promise<TrendingTopic[]> {
    try {
      const languages = ['javascript', 'typescript', 'python', 'go', 'rust']
      const trends: TrendingTopic[] = []

      for (const language of languages) {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=5`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
            },
            next: { revalidate: 7200 } // Cache for 2 hours
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.items?.length > 0) {
            trends.push({
              name: `#${language}`,
              volume: data.items[0].stargazers_count,
              category: this.mapLanguageToCategory(language),
              description: `${data.items[0].name} - ${data.items[0].description?.slice(0, 50)}...`
            })
          }
        }
      }

      // Add some static trending topics
      trends.push(
        { name: '#AI', volume: 450000, category: 'AI', description: 'Artificial Intelligence developments' },
        { name: '#LLM', volume: 230000, category: 'LLM', description: 'Large Language Models' },
        { name: '#WebDev', volume: 180000, category: 'WebDev', description: 'Web Development trends' }
      )

      return trends
    } catch (error) {
      console.error('GitHub trending fetch error:', error)
      return []
    }
  }

  // X/Twitter integration (requires paid API)
  async fetchTwitterContent(): Promise<TechArticle[]> {
    if (!this.X_BEARER_TOKEN) return []

    try {
      const queries = [
        'AI OR "artificial intelligence" has:links min_faves:50 -is:retweet',
        'LLM OR "large language model" has:links min_faves:30 -is:retweet',
        '"React" OR "Next.js" has:links min_faves:100 -is:retweet',
        '"full stack" OR "fullstack" has:links min_faves:50 -is:retweet'
      ]

      const articles: TechArticle[] = []

      for (const query of queries) {
        const response = await fetch(
          `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=public_metrics,entities,created_at&expansions=author_id&user.fields=username,name&max_results=10`,
          {
            headers: {
              'Authorization': `Bearer ${this.X_BEARER_TOKEN}`,
              'Content-Type': 'application/json'
            },
            next: { revalidate: 900 } // Cache for 15 minutes
          }
        )

        if (response.ok) {
          const data = await response.json()
          
          if (data.data?.length > 0) {
            const tweetArticles = data.data
              .filter((tweet: any) => tweet.entities?.urls?.length > 0)
              .slice(0, 3)
              .map((tweet: any) => {
                const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id)
                const mainUrl = tweet.entities.urls[0]
                
                return {
                  id: `twitter-${tweet.id}`,
                  title: tweet.text.length > 100 ? tweet.text.slice(0, 100) + '...' : tweet.text,
                  description: `Shared by @${author?.username || 'unknown'}`,
                  url: mainUrl.expanded_url || mainUrl.url,
                  source: 'X (Twitter)',
                  publishedAt: tweet.created_at,
                  tags: this.extractTags(tweet.text, 'social'),
                  engagement: {
                    likes: tweet.public_metrics.like_count,
                    shares: tweet.public_metrics.retweet_count,
                    comments: tweet.public_metrics.reply_count
                  }
                }
              })

            articles.push(...tweetArticles)
          }
        }
      }

      return articles.slice(0, 6)
    } catch (error) {
      console.error('Twitter fetch error:', error)
      return []
    }
  }

  // Main aggregation function
  async fetchAllContent(): Promise<{ articles: TechArticle[], trends: TrendingTopic[] }> {
    const [
      newsArticles,
      hnArticles,
      devToArticles,
      twitterArticles,
      githubTrends
    ] = await Promise.allSettled([
      this.fetchNewsAPIContent(),
      this.fetchHackerNewsContent(),
      this.fetchDevToContent(),
      this.fetchTwitterContent(),
      this.fetchGitHubTrending()
    ])

    const allArticles = [
      ...(newsArticles.status === 'fulfilled' ? newsArticles.value : []),
      ...(hnArticles.status === 'fulfilled' ? hnArticles.value : []),
      ...(devToArticles.status === 'fulfilled' ? devToArticles.value : []),
      ...(twitterArticles.status === 'fulfilled' ? twitterArticles.value : [])
    ]

    const allTrends = githubTrends.status === 'fulfilled' ? githubTrends.value : []

    // Sort articles by engagement and recency
    const sortedArticles = allArticles
      .sort((a, b) => {
        const aScore = (a.engagement?.likes || 0) + new Date(a.publishedAt).getTime() / 1000000
        const bScore = (b.engagement?.likes || 0) + new Date(b.publishedAt).getTime() / 1000000
        return bScore - aScore
      })
      .slice(0, 20) // Limit to top 20 articles

    return {
      articles: sortedArticles,
      trends: allTrends
    }
  }

  // Helper methods
  private extractTags(text: string, context: string): string[] {
    const techKeywords = {
      'AI': ['ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt', 'llm'],
      'LLM': ['llm', 'language model', 'gpt', 'bert', 'transformer'],
      'React': ['react', 'jsx', 'hooks', 'component'],
      'JavaScript': ['javascript', 'js', 'node', 'npm'],
      'TypeScript': ['typescript', 'ts', 'type'],
      'Full-Stack': ['fullstack', 'full stack', 'backend', 'frontend'],
      'WebDev': ['web dev', 'html', 'css', 'frontend', 'backend']
    }

    const foundTags: string[] = []
    const lowerText = text.toLowerCase()

    for (const [tag, keywords] of Object.entries(techKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        foundTags.push(tag)
      }
    }

    return foundTags.length > 0 ? foundTags : [context]
  }

  private isTechRelated(title: string): boolean {
    const techTerms = [
      'ai', 'artificial intelligence', 'machine learning', 'react', 'javascript', 
      'typescript', 'python', 'web', 'api', 'database', 'cloud', 'aws', 'azure',
      'docker', 'kubernetes', 'git', 'github', 'programming', 'development',
      'frontend', 'backend', 'fullstack', 'node', 'vue', 'angular', 'next.js'
    ]
    
    return techTerms.some(term => title.toLowerCase().includes(term))
  }

  private mapLanguageToCategory(language: string): TrendingTopic['category'] {
    const mapping: Record<string, TrendingTopic['category']> = {
      javascript: 'WebDev',
      typescript: 'FullStack',
      python: 'AI',
      go: 'Tech',
      rust: 'Tech'
    }
    return mapping[language] || 'Tech'
  }
}

// Export the types for use in other files
export type { TechArticle, TrendingTopic }