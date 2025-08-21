import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminCookie = req.cookies['admin-auth']
  
  if (adminCookie === 'authenticated') {
    return res.status(200).json({ authenticated: true })
  } else {
    return res.status(401).json({ authenticated: false })
  }
}