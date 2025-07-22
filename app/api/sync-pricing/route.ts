import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST() {
  try {
    // Read the mock pricing data
    const filePath = path.join(process.cwd(), 'public', 'api', 'pricing-data.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const pricingData = JSON.parse(fileContent)
    
    // Transform the data to match Sanity's expected format
    const transformedPlans = pricingData.plans.map((plan: { id: string; name: string; description: string; price: number; billing: string; features: string[]; highlighted: boolean; ctaText: string }) => ({
      _type: 'pricingPlan',
      _key: plan.id,
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing: plan.billing,
      features: plan.features,
      highlighted: plan.highlighted,
      ctaText: plan.ctaText,
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        pricingPlans: transformedPlans,
        lastSynced: new Date().toISOString(),
        syncWithApi: true,
      },
      message: `Successfully synced ${transformedPlans.length} pricing plans`
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync pricing data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}