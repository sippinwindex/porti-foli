import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Clear the admin cookie using Next.js built-in method
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieOptions = [
    'admin-auth=',
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT', // Expire immediately
    ...(isProduction ? ['Secure'] : [])
  ].join('; ')

  res.setHeader('Set-Cookie', cookieOptions)
  return res.status(200).json({ success: true })
}