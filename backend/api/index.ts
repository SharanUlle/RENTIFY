// Vercel serverless entry point
// This file connects to the DB and exports the Express app for Vercel to use as a serverless function

import { connectDB } from '../src/config/database'
import app from '../src/app'

let isConnected = false

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    await connectDB()
    isConnected = true
  }
  return app(req, res)
}

export default handler
