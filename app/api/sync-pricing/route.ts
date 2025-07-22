import { NextRequest, NextResponse } from 'next/server'
import { sanityClientAuth } from '@/lib/sanity'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    
    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Get the document
    const document = await sanityClientAuth.fetch(
      '*[_id == $id][0]',
      { id: documentId }
    )

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Find pricing sections with sync enabled
    const content = document.content || []
    let hasUpdates = false
    
    const updatedContent = await Promise.all(
      content.map(async (item: Record<string, unknown>) => {
        if (item._type === 'pricingSection' && item.syncWithApi && item.apiEndpoint) {
          try {
            console.log('Syncing pricing data from:', item.apiEndpoint)
            
            const response = await fetch(item.apiEndpoint as string)
            if (!response.ok) {
              throw new Error(`Failed to fetch: ${response.statusText}`)
            }
            
            const data = await response.json()
            
            const transformedPlans = data.plans?.map((plan: Record<string, unknown>) => ({
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
            })) || []
            
            hasUpdates = true
            return {
              ...item,
              pricingPlans: transformedPlans,
              lastSynced: new Date().toISOString(),
            }
          } catch (error) {
            console.error('Sync error:', error)
            return item
          }
        }
        return item
      })
    )

    if (hasUpdates) {
      // Update the document
      await sanityClientAuth
        .patch(documentId)
        .set({ content: updatedContent })
        .commit()

      return NextResponse.json({ 
        success: true, 
        message: 'Pricing data synced successfully',
        updatedSections: content.filter(item => 
          item._type === 'pricingSection' && item.syncWithApi
        ).length
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'No pricing sections found to sync' 
    })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync pricing data' },
      { status: 500 }
    )
  }
}