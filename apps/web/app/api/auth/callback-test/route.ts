import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Auth callback API is working' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Auth callback received:', body)
    
    return NextResponse.json({ status: 'received', data: body })
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
