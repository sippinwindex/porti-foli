// utils/portfolio-debug.ts - FIXED debugging utilities
interface DebugInfo {
  timestamp: string
  environment: string
  userAgent?: string
  location?: string
  apis: {
    [key: string]: {
      available: boolean
      tested: boolean
      status?: number
      error?: string
    }
  }
  performance: {
    [key: string]: number
  }
  errors: Array<{
    timestamp: string
    type: string
    message: string
    stack?: string
  }>
}

class PortfolioDebugger {
  private static instance: PortfolioDebugger
  private debugInfo: DebugInfo
  private errorLog: Array<any> = []

  private constructor() {
    this.debugInfo = {
      timestamp: new Date().toISOString(),
      environment: this.getEnvironment(),
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'server',
      location: typeof window !== 'undefined' ? window.location?.href : 'server',
      apis: {},
      performance: {},
      errors: []
    }
    
    this.setupErrorTracking()
  }

  public static getInstance(): PortfolioDebugger {
    if (!PortfolioDebugger.instance) {
      PortfolioDebugger.instance = new PortfolioDebugger()
    }
    return PortfolioDebugger.instance
  }

  private getEnvironment(): string {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' ? 'development' : 'production'
    }
    return process.env.NODE_ENV || 'unknown'
  }

  private setupErrorTracking() {
    if (typeof window !== 'undefined') {
      const originalConsoleError = console.error
      console.error = (...args) => {
        this.logError('console', args.join(' '))
        originalConsoleError.apply(console, args)
      }

      window.addEventListener('error', (event) => {
        this.logError('javascript', event.message, event.error?.stack)
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.logError('promise', event.reason?.toString())
      })
    }
  }

  public logError(type: string, message: string, stack?: string) {
    const error = {
      timestamp: new Date().toISOString(),
      type,
      message,
      stack
    }
    
    this.debugInfo.errors.push(error)
    this.errorLog.push(error)
    
    // Keep only last 50 errors
    if (this.debugInfo.errors.length > 50) {
      this.debugInfo.errors = this.debugInfo.errors.slice(-50)
    }
  }

  public async testAPI(endpoint: string, name?: string): Promise<boolean> {
    const apiName = name || endpoint
    const startTime = performance.now()
    
    try {
      const response = await fetch(endpoint)
      const endTime = performance.now()
      
      this.debugInfo.apis[apiName] = {
        available: true,
        tested: true,
        status: response.status
      }
      
      this.debugInfo.performance[`${apiName}_response_time`] = endTime - startTime
      
      return response.ok
    } catch (error) {
      const endTime = performance.now()
      
      this.debugInfo.apis[apiName] = {
        available: false,
        tested: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      this.debugInfo.performance[`${apiName}_response_time`] = endTime - startTime
      this.logError('api', `${apiName}: ${error}`)
      
      return false
    }
  }

  public async runAllTests(): Promise<DebugInfo> {
    console.log('🧪 Running Portfolio Debug Tests...')
    
    const apiEndpoints = [
      { endpoint: '/api/test', name: 'Test API' },
      { endpoint: '/api/github', name: 'GitHub API' },
      { endpoint: '/api/github/repositories', name: 'GitHub Repositories' },
      { endpoint: '/api/github/stats', name: 'GitHub Stats' },
      { endpoint: '/api/projects', name: 'Projects API' },
      { endpoint: '/api/portfolio-stats', name: 'Portfolio Stats' }
    ]

    for (const { endpoint, name } of apiEndpoints) {
      await this.testAPI(endpoint, name)
    }

    return this.getDebugInfo()
  }

  public getDebugInfo(): DebugInfo {
    return { ...this.debugInfo }
  }

  public exportDebugInfo(): string {
    return JSON.stringify(this.debugInfo, null, 2)
  }

  public clearErrors() {
    this.debugInfo.errors = []
    this.errorLog = []
  }

  public getPerformanceMetrics() {
    return { ...this.debugInfo.performance }
  }

  public getErrorSummary() {
    const errorCounts = this.debugInfo.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalErrors: this.debugInfo.errors.length,
      errorsByType: errorCounts,
      recentErrors: this.debugInfo.errors.slice(-5)
    }
  }

  public logCustomEvent(event: string, data?: any) {
    console.log(`🐛 Debug Event: ${event}`, data)
    
    if (!this.debugInfo.performance[`custom_${event}`]) {
      this.debugInfo.performance[`custom_${event}`] = 0
    }
    this.debugInfo.performance[`custom_${event}`]++
  }

  public measurePerformance<T>(name: string, fn: () => T | Promise<T>): T | Promise<T> {
    const startTime = performance.now()
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const endTime = performance.now()
        this.debugInfo.performance[name] = endTime - startTime
      })
    } else {
      const endTime = performance.now()
      this.debugInfo.performance[name] = endTime - startTime
      return result
    }
  }
}

// FIXED: Renamed from 'debugger' to 'portfolioDebugger' to avoid reserved word
export const portfolioDebugger = PortfolioDebugger.getInstance()

// FIXED: Properly defined runAllTests function
export const runAllTests = () => portfolioDebugger.runAllTests()

// Convenience functions
export const logError = (type: string, message: string, stack?: string) => 
  portfolioDebugger.logError(type, message, stack)

export const testAPI = (endpoint: string, name?: string) => 
  portfolioDebugger.testAPI(endpoint, name)

export const getDebugInfo = () => 
  portfolioDebugger.getDebugInfo()

export const exportDebugInfo = () => 
  portfolioDebugger.exportDebugInfo()

export const logCustomEvent = (event: string, data?: any) => 
  portfolioDebugger.logCustomEvent(event, data)

export const measurePerformance = <T>(name: string, fn: () => T | Promise<T>) => 
  portfolioDebugger.measurePerformance(name, fn)

// Browser-friendly debug panel
export function createDebugPanel() {
  if (typeof window === 'undefined') return

  const panel = document.createElement('div')
  panel.id = 'portfolio-debug-panel'
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 300px;
    max-height: 400px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    z-index: 10000;
    overflow-y: auto;
    border: 1px solid #333;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: none;
  `

  const toggleButton = document.createElement('button')
  toggleButton.textContent = '🐛'
  toggleButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10001;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `

  let isVisible = false

  toggleButton.onclick = async () => {
    isVisible = !isVisible
    panel.style.display = isVisible ? 'block' : 'none'
    
    if (isVisible) {
      toggleButton.textContent = '❌'
      toggleButton.style.right = '320px'
      
      // Run tests and update panel
      const debugInfo = await runAllTests()
      updatePanelContent(panel, debugInfo)
    } else {
      toggleButton.textContent = '🐛'
      toggleButton.style.right = '10px'
    }
  }

  document.body.appendChild(toggleButton)
  document.body.appendChild(panel)

  return { panel, toggleButton }
}

function updatePanelContent(panel: HTMLElement, debugInfo: DebugInfo) {
  const summary = portfolioDebugger.getErrorSummary()
  const performance = portfolioDebugger.getPerformanceMetrics()

  panel.innerHTML = `
    <div style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px;">
      <strong>Portfolio Debug Panel</strong>
      <br>
      <small>${debugInfo.environment} • ${new Date().toLocaleTimeString()}</small>
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong>🔗 API Status</strong>
      ${Object.entries(debugInfo.apis).map(([name, api]) => `
        <div style="margin: 5px 0; padding: 3px; background: ${api.available ? '#2d5a2d' : '#5a2d2d'}; border-radius: 3px;">
          ${api.available ? '✅' : '❌'} ${name} ${api.status ? `(${api.status})` : ''}
          ${api.error ? `<br><small style="color: #ff9999;">${api.error}</small>` : ''}
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong>⚡ Performance</strong>
      ${Object.entries(performance).map(([name, time]) => `
        <div style="margin: 2px 0; font-size: 11px;">
          ${name}: ${typeof time === 'number' ? `${time.toFixed(2)}ms` : time}
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 15px;">
      <strong>🚨 Errors (${summary.totalErrors})</strong>
      ${summary.recentErrors.map(error => `
        <div style="margin: 5px 0; padding: 3px; background: #3d1a1a; border-radius: 3px; font-size: 10px;">
          <strong>${error.type}:</strong> ${error.message}
          <br><small style="color: #999;">${new Date(error.timestamp).toLocaleTimeString()}</small>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #333;">
      <button onclick="navigator.clipboard.writeText('${portfolioDebugger.exportDebugInfo().replace(/'/g, "\\'")}'); alert('Debug info copied!')" 
              style="background: #4a4a4a; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">
        📋 Copy Debug Info
      </button>
      <button onclick="portfolioDebugger.clearErrors(); location.reload()" 
              style="background: #4a4a4a; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; margin-left: 5px;">
        🗑️ Clear & Reload
      </button>
    </div>
  `
}

// Automatic initialization in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  setTimeout(() => {
    createDebugPanel()
  }, 1000)
}

export default portfolioDebugger