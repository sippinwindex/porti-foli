// app/api/vercel/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface VercelProject {
  id: string
  name: string
  accountId: string
  updatedAt: number
  createdAt: number
}

interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  alias?: string[]
}

const VERCEL_TOKEN = process.env.VERCEL_TOKEN

async function fetchFromVercel(endpoint: string) {
  const response = await fetch(`https://api.vercel.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 } // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.status}`)
  }

  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    if (!VERCEL_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel token not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'projects'
    
    switch (type) {
      case 'projects': {
        console.log('🔄 Fetching Vercel projects...')
        
        const data = await fetchFromVercel('/v9/projects')
        const projects: VercelProject[] = data.projects || []
        
        console.log(`✅ Found ${projects.length} Vercel projects`)
        
        return NextResponse.json(projects, {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          },
        })
      }

      case 'deployments': {
        const projectId = searchParams.get('projectId')
        if (!projectId) {
          return NextResponse.json(
            { error: 'Project ID is required for deployments' },
            { status: 400 }
          )
        }

        console.log(`🔄 Fetching deployments for project: ${projectId}`)
        
        const data = await fetchFromVercel(`/v6/deployments?projectId=${projectId}&limit=10`)
        const deployments: VercelDeployment[] = data.deployments || []
        
        console.log(`✅ Found ${deployments.length} deployments`)
        
        return NextResponse.json(deployments, {
          headers: {
            'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
          },
        })
      }

      case 'status': {
        console.log('🔄 Fetching projects with deployment status...')
        
        const projectsData = await fetchFromVercel('/v9/projects')
        const projects: VercelProject[] = projectsData.projects || []
        
        // Get latest deployment for each project
        const projectsWithStatus = await Promise.all(
          projects.slice(0, 10).map(async (project) => {
            try {
              const deploymentsData = await fetchFromVercel(
                `/v6/deployments?projectId=${project.id}&limit=1`
              )
              const latestDeployment = deploymentsData.deployments?.[0]
              
              let liveUrl: string | undefined
              if (latestDeployment && latestDeployment.state === 'READY') {
                liveUrl = latestDeployment.alias?.[0] || `https://${latestDeployment.url}`
              }

              return {
                project,
                status: latestDeployment,
                liveUrl,
                isLive: latestDeployment?.state === 'READY'
              }
            } catch (error) {
              console.warn(`Failed to fetch deployment for ${project.name}:`, error)
              return {
                project,
                status: null,
                liveUrl: undefined,
                isLive: false
              }
            }
          })
        )
        
        console.log(`✅ Processed ${projectsWithStatus.length} projects with status`)
        
        return NextResponse.json(projectsWithStatus, {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          },
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: projects, deployments, or status' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('❌ Vercel API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch Vercel data',
        message: error instanceof Error ? error.message : 'Service temporarily unavailable'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}