import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
    env: process.env.NODE_ENV,
    apis: {
      '/api/proposals': 'Database API (may fail due to constraints)',
      '/api/proposals-mock': 'Mock API (always works)',
      '/api/health': 'This health check',
      '/api/debug': 'Database debug info'
    },
    message: 'Sistema funcionando - use /api/proposals-mock para dados garantidos'
  })
}