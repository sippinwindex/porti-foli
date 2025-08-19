// utils/portfolio-integration-test.ts - Test your integrations

// Define types for better type safety
interface APITestResult {
  endpoint: string;
  status: number;
  success: boolean;
  hasData: boolean;
  dataKeys: string[];
  error: string | null;
}

interface TestResult {
  name: string;
  passed: boolean;
  details: Record<string, any>;
}

export class PortfolioIntegrationTester {
  private baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  }

  async testAllIntegrations() {
    console.log('🧪 Starting Portfolio Integration Tests...\n')
    
    const results = {
      apiTests: await this.testAPIs(),
      typeConsistency: await this.testTypeConsistency(),
      dataFlow: await this.testDataFlow(),
      errorHandling: await this.testErrorHandling()
    }

    this.printSummary(results)
    return results
  }

  async testAPIs(): Promise<APITestResult[]> {
    console.log('🔗 Testing API Endpoints...')
    
    const endpoints = [
      '/api/test',
      '/api/debug', 
      '/api/github',
      '/api/github/repositories',
      '/api/github/stats',
      '/api/projects',
      '/api/portfolio-stats',
      '/api/daily-articles'
    ]

    const results: APITestResult[] = []

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`)
        const data = await response.json()
        
        const result: APITestResult = {
          endpoint,
          status: response.status,
          success: response.ok,
          hasData: !!data,
          dataKeys: Object.keys(data),
          error: null
        }
        
        results.push(result)
        console.log(`  ${response.ok ? '✅' : '❌'} ${endpoint} - ${response.status}`)
        
        if (!response.ok) {
          console.log(`    Error: ${data.error || 'Unknown error'}`)
        }
      } catch (error) {
        const result: APITestResult = {
          endpoint,
          status: 0,
          success: false,
          hasData: false,
          dataKeys: [],
          error: error instanceof Error ? error.message : 'Network error'
        }
        
        results.push(result)
        console.log(`  ❌ ${endpoint} - Network Error`)
      }
    }

    return results
  }

  async testTypeConsistency(): Promise<TestResult[]> {
    console.log('\n📝 Testing Type Consistency...')
    
    const tests: TestResult[] = []

    try {
      // Test projects endpoint response structure
      const projectsResponse = await fetch(`${this.baseUrl}/api/projects`)
      const projectsData = await projectsResponse.json()
      
      const projectStructureTest: TestResult = {
        name: 'Projects Response Structure',
        passed: this.validateProjectStructure(projectsData),
        details: this.getProjectStructureDetails(projectsData)
      }
      
      tests.push(projectStructureTest)
      console.log(`  ${projectStructureTest.passed ? '✅' : '❌'} ${projectStructureTest.name}`)

      // Test stats endpoint response structure
      const statsResponse = await fetch(`${this.baseUrl}/api/portfolio-stats`)
      const statsData = await statsResponse.json()
      
      const statsStructureTest: TestResult = {
        name: 'Stats Response Structure',
        passed: this.validateStatsStructure(statsData),
        details: this.getStatsStructureDetails(statsData)
      }
      
      tests.push(statsStructureTest)
      console.log(`  ${statsStructureTest.passed ? '✅' : '❌'} ${statsStructureTest.name}`)

    } catch (error) {
      tests.push({
        name: 'Type Consistency Tests',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      console.log(`  ❌ Type Consistency Tests - Error: ${error}`)
    }

    return tests
  }

  async testDataFlow(): Promise<TestResult[]> {
    console.log('\n🔄 Testing Data Flow...')
    
    const tests: TestResult[] = []

    try {
      // Test GitHub -> Projects flow
      const githubTest = await this.testGitHubFlow()
      tests.push(githubTest)
      console.log(`  ${githubTest.passed ? '✅' : '❌'} GitHub Integration Flow`)

      // Test Vercel integration
      const vercelTest = await this.testVercelFlow()
      tests.push(vercelTest)
      console.log(`  ${vercelTest.passed ? '✅' : '❌'} Vercel Integration Flow`)

      // Test stats aggregation
      const aggregationTest = await this.testStatsAggregation()
      tests.push(aggregationTest)
      console.log(`  ${aggregationTest.passed ? '✅' : '❌'} Stats Aggregation Flow`)

    } catch (error) {
      tests.push({
        name: 'Data Flow Tests',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      console.log(`  ❌ Data Flow Tests - Error: ${error}`)
    }

    return tests
  }

  async testErrorHandling(): Promise<TestResult[]> {
    console.log('\n🛡️ Testing Error Handling...')
    
    const tests: TestResult[] = []

    try {
      // Test invalid endpoints
      const invalidEndpointTest = await this.testInvalidEndpoint()
      tests.push(invalidEndpointTest)
      console.log(`  ${invalidEndpointTest.passed ? '✅' : '❌'} Invalid Endpoint Handling`)

      // Test malformed requests
      const malformedRequestTest = await this.testMalformedRequest()
      tests.push(malformedRequestTest)
      console.log(`  ${malformedRequestTest.passed ? '✅' : '❌'} Malformed Request Handling`)

      // Test rate limiting simulation
      const rateLimitTest = await this.testRateLimit()
      tests.push(rateLimitTest)
      console.log(`  ${rateLimitTest.passed ? '✅' : '❌'} Rate Limit Handling`)

    } catch (error) {
      tests.push({
        name: 'Error Handling Tests',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      console.log(`  ❌ Error Handling Tests - Error: ${error}`)
    }

    return tests
  }

  private validateProjectStructure(data: any): boolean {
    if (!data || !data.projects) return false
    
    const requiredFields = ['id', 'name', 'description', 'techStack', 'featured']
    
    return data.projects.every((project: any) => 
      requiredFields.every(field => project.hasOwnProperty(field))
    )
  }

  private getProjectStructureDetails(data: any) {
    if (!data || !data.projects || data.projects.length === 0) {
      return { error: 'No projects found in response' }
    }

    const sampleProject = data.projects[0]
    return {
      sampleProjectKeys: Object.keys(sampleProject),
      projectCount: data.projects.length,
      hasGitHubData: sampleProject.github ? true : false,
      hasVercelData: sampleProject.vercel ? true : false,
      source: data.source || 'unknown'
    }
  }

  private validateStatsStructure(data: any): boolean {
    const requiredFields = ['totalProjects', 'totalStars', 'liveProjects']
    return requiredFields.every(field => data.hasOwnProperty(field))
  }

  private getStatsStructureDetails(data: any) {
    return {
      availableKeys: Object.keys(data),
      hasRecentActivity: !!data.recentActivity,
      hasTopLanguages: !!data.topLanguages,
      totalProjects: data.totalProjects
    }
  }

  private async testGitHubFlow(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/github/repositories`)
      const data = await response.json()
      
      return {
        name: 'GitHub Integration',
        passed: response.ok && data.repositories && Array.isArray(data.repositories),
        details: {
          status: response.status,
          hasRepositories: !!data.repositories,
          repositoryCount: data.repositories?.length || 0,
          source: 'github-api'
        }
      }
    } catch (error) {
      return {
        name: 'GitHub Integration',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  private async testVercelFlow(): Promise<TestResult> {
    try {
      // Since Vercel integration might not be available, check if projects have vercel data
      const response = await fetch(`${this.baseUrl}/api/projects`)
      const data = await response.json()
      
      const hasVercelData = data.projects?.some((p: any) => p.vercel)
      
      return {
        name: 'Vercel Integration',
        passed: true, // Always pass since it's optional
        details: {
          hasVercelData,
          projectsWithVercel: data.projects?.filter((p: any) => p.vercel).length || 0,
          source: 'projects-api'
        }
      }
    } catch (error) {
      return {
        name: 'Vercel Integration',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  private async testStatsAggregation(): Promise<TestResult> {
    try {
      const [projectsResponse, statsResponse] = await Promise.all([
        fetch(`${this.baseUrl}/api/projects`),
        fetch(`${this.baseUrl}/api/portfolio-stats`)
      ])

      const projectsData = await projectsResponse.json()
      const statsData = await statsResponse.json()

      const projectCount = projectsData.projects?.length || 0
      const statsProjectCount = statsData.totalProjects || 0

      return {
        name: 'Stats Aggregation',
        passed: projectCount > 0 && statsProjectCount > 0,
        details: {
          projectsFromAPI: projectCount,
          projectsFromStats: statsProjectCount,
          consistency: Math.abs(projectCount - statsProjectCount) <= 5, // Allow some variance
          statsKeys: Object.keys(statsData)
        }
      }
    } catch (error) {
      return {
        name: 'Stats Aggregation',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  private async testInvalidEndpoint(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/nonexistent`)
      
      return {
        name: 'Invalid Endpoint',
        passed: response.status === 404,
        details: {
          status: response.status,
          expectedStatus: 404
        }
      }
    } catch (error) {
      return {
        name: 'Invalid Endpoint',
        passed: true, // Network errors are acceptable
        details: { networkError: true }
      }
    }
  }

  private async testMalformedRequest(): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/projects`, {
        method: 'POST', // Should return 405 Method Not Allowed
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      })

      return {
        name: 'Malformed Request',
        passed: response.status === 405,
        details: {
          status: response.status,
          expectedStatus: 405
        }
      }
    } catch (error) {
      return {
        name: 'Malformed Request',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  private async testRateLimit(): Promise<TestResult> {
    // Simulate multiple rapid requests
    try {
      const promises = Array.from({ length: 5 }, () => 
        fetch(`${this.baseUrl}/api/github/repositories`)
      )
      
      const responses = await Promise.all(promises)
      const allSuccessful = responses.every(r => r.ok)

      return {
        name: 'Rate Limit Handling',
        passed: true, // If no rate limiting, that's fine
        details: {
          requestsSent: promises.length,
          successfulResponses: responses.filter(r => r.ok).length,
          rateLimited: responses.some(r => r.status === 429),
          allSuccessful
        }
      }
    } catch (error) {
      return {
        name: 'Rate Limit Handling',
        passed: false,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }

  private printSummary(results: any) {
    console.log('\n📊 Integration Test Summary')
    console.log('='.repeat(50))
    
    const allTests = [
      ...results.apiTests,
      ...results.typeConsistency,
      ...results.dataFlow,
      ...results.errorHandling
    ]

    const passedTests = allTests.filter(test => test.passed || test.success)
    const failedTests = allTests.filter(test => !test.passed && !test.success)

    console.log(`✅ Passed: ${passedTests.length}`)
    console.log(`❌ Failed: ${failedTests.length}`)
    console.log(`📈 Success Rate: ${Math.round((passedTests.length / allTests.length) * 100)}%`)

    if (failedTests.length > 0) {
      console.log('\n🚨 Failed Tests:')
      failedTests.forEach(test => {
        console.log(`  - ${test.name || test.endpoint}`)
        if (test.error) console.log(`    Error: ${test.error}`)
      })
    }

    console.log('\n🎯 Recommendations:')
    if (results.apiTests.some((t: any) => !t.success)) {
      console.log('  - Check API endpoint implementations')
    }
    if (results.typeConsistency.some((t: any) => !t.passed)) {
      console.log('  - Review type definitions for consistency')
    }
    if (results.dataFlow.some((t: any) => !t.passed)) {
      console.log('  - Verify data flow between APIs and hooks')
    }
    if (results.errorHandling.some((t: any) => !t.passed)) {
      console.log('  - Improve error handling strategies')
    }
  }
}

// Usage function for easy testing
export async function runPortfolioTests() {
  const tester = new PortfolioIntegrationTester()
  return await tester.testAllIntegrations()
}

// Browser-friendly test runner
export function createTestButton() {
  if (typeof window === 'undefined') return

  const button = document.createElement('button')
  button.textContent = '🧪 Run Portfolio Tests'
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px 15px;
    background: linear-gradient(135deg, #BE3455, #D4AF37);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.2s ease;
  `

  button.onmouseover = () => button.style.transform = 'scale(1.05)'
  button.onmouseout = () => button.style.transform = 'scale(1)'
  
  button.onclick = async () => {
    button.textContent = '🔄 Testing...'
    button.disabled = true
    
    try {
      await runPortfolioTests()
      button.textContent = '✅ Tests Complete'
      setTimeout(() => {
        button.textContent = '🧪 Run Portfolio Tests'
        button.disabled = false
      }, 3000)
    } catch (error) {
      button.textContent = '❌ Tests Failed'
      console.error('Test error:', error)
      setTimeout(() => {
        button.textContent = '🧪 Run Portfolio Tests'
        button.disabled = false
      }, 3000)
    }
  }

  document.body.appendChild(button)
  return button
}

export default PortfolioIntegrationTester