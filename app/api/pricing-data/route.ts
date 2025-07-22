import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Read the pricing data from the JSON file
    const filePath = path.join(process.cwd(), 'public', 'api', 'pricing-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const pricingData = JSON.parse(fileContent)
    
    // Add CORS headers for Sanity Studio
    return NextResponse.json(pricingData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Error reading pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}