import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to access the database bypassing RLS
    const { data, error, count } = await getSupabaseAdmin()
      .from('proposals')
      .select('id, name, client, status, created_at', { count: 'exact' })
      .limit(1)

    return NextResponse.json({
      success: !error,
      error: error?.message,
      data,
      count,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}

export async function POST() {
  try {
    // Try to insert a simple test record
    const testProposal = {
      name: 'Debug Test Proposal',
      client: 'Test Client',
      value: 1000,
      slug: 'debug-test-proposal',
      status: 'draft',
      version: 1,
      created_by: null,
      content_json: {
        title: "THE FORCE",
        subtitle: "X THE FORCE", 
        proposalTitle: "Debug Test Proposal",
        clientName: "Test Client",
        projectDescription: "This is a debug test proposal"
      }
    }

    const { data, error } = await getSupabaseAdmin()
      .from('proposals')
      .insert(testProposal)
      .select()
      .single()

    return NextResponse.json({
      success: !error,
      error: error?.message,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}