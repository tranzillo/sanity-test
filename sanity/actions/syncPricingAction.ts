import { DocumentActionComponent, useDocumentOperation } from 'sanity'
import { SyncIcon } from '@sanity/icons'

export const syncPricingAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const { draft, published } = props

  // Only show the action if there are pricing sections with sync enabled
  const content = draft?.content || published?.content || []
  const hasSyncablePricing = content.some((item: any) => 
    item._type === 'pricingSection' && item.syncWithApi
  )

  if (!hasSyncablePricing) {
    return null
  }

  return {
    label: 'Sync Pricing Data',
    icon: SyncIcon,
    shortcut: 'ctrl+shift+s',
    onHandle: async () => {
      try {
        // Find pricing sections in the document
        let hasUpdates = false
        const updatedContent = await Promise.all(
          content.map(async (item: any) => {
            if (item._type === 'pricingSection' && item.syncWithApi && item.apiEndpoint) {
              try {
                console.log('Syncing pricing data from:', item.apiEndpoint)
                
                const response = await fetch(item.apiEndpoint)
                if (!response.ok) {
                  throw new Error(`Failed to fetch: ${response.statusText}`)
                }
                
                const data = await response.json()
                console.log('Received data:', data)
                
                const transformedPlans = data.plans?.map((plan: any) => ({
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
                
                console.log('Transformed plans:', transformedPlans)
                hasUpdates = true
                
                return {
                  ...item,
                  pricingPlans: transformedPlans,
                  lastSynced: new Date().toISOString(),
                }
              } catch (error) {
                console.error('Sync error:', error)
                // Show error to user
                alert(`Failed to sync pricing data: ${error instanceof Error ? error.message : 'Unknown error'}`)
                return item
              }
            }
            return item
          })
        )
        
        if (hasUpdates) {
          patch.execute([{ set: { content: updatedContent } }])
          alert('Pricing data synced successfully!')
        }
        
      } catch (error) {
        console.error('Action error:', error)
        alert(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
  }
}