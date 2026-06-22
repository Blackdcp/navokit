import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const headers = Object.fromEntries(req.headers.entries())
  return NextResponse.json({
    headers,
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  })
}
