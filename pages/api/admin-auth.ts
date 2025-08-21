import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { password } = req.body
    
    // Server-only environment variable (NOT visible to client)
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    if (password === adminPassword) {
      // Set secure HTTP-only cookie using Next.js built-in method
      const isProduction = process.env.NODE_ENV === 'production'
      const cookieOptions = [
        'admin-auth=authenticated',
        'HttpOnly',
        'SameSite=Strict',
        'Path=/',
        'Max-Age=7200', // 2 hours
        ...(isProduction ? ['Secure'] : [])
      ].join('; ')

      res.setHeader('Set-Cookie', cookieOptions)
      return res.status(200).json({ success: true })
    } else {
      // Wrong password
      return res.status(401).json({ error: 'Invalid password' })
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}