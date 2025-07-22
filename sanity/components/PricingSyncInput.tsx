import React, { useCallback, useState, useEffect } from 'react'
import { set, unset, useFormValue } from 'sanity'
import { Button, Card, Stack, Text, useToast } from '@sanity/ui'
import { SyncIcon } from '@sanity/icons'

export function PricingSyncInput(props: any) {
  const { onChange, value = [], parent, path } = props
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  
  // Get the full document value to access sibling fields
  const document = useFormValue([]) as any

  const handleSync = useCallback(async () => {
    if (!parent?.syncWithApi || !parent?.apiEndpoint) {
      toast.push({
        status: 'warning',
        title: 'Sync not enabled',
        description: 'Enable "Sync with API" and provide an endpoint first',
      })
      return
    }

    setLoading(true)
    
    try {
      console.log('Fetching data from:', parent.apiEndpoint)
      
      // Fetch data from the API endpoint  
      const response = await fetch(parent.apiEndpoint)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Fetched data:', data)
      
      // Transform the API data to match our schema
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
      
      // Update the pricing plans array using the document-level onChange
      const pathToPricingPlans = path.slice(0, -1).concat(['pricingPlans'])
      onChange([
        set(transformedPlans, pathToPricingPlans),
        set(new Date().toISOString(), path.slice(0, -1).concat(['lastSynced']))
      ])
      
      toast.push({
        status: 'success',
        title: 'Sync successful',
        description: `Synced ${transformedPlans.length} pricing plans`,
      })
    } catch (error) {
      console.error('Sync error:', error)
      toast.push({
        status: 'error',
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setLoading(false)
    }
  }, [parent, onChange, toast])

  // Auto-sync when sync is first enabled and no data exists
  useEffect(() => {
    if (parent?.syncWithApi && (!parent?.pricingPlans || parent?.pricingPlans.length === 0) && !loading) {
      handleSync()
    }
  }, [parent?.syncWithApi, parent?.pricingPlans, loading, handleSync])

  return (
    <Card padding={3} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text size={2} weight="semibold">
          🔄 API Sync Controls
        </Text>
        {parent?.lastSynced && (
          <Text size={1} muted>
            Last synced: {new Date(parent.lastSynced).toLocaleString()}
          </Text>
        )}
        <Button
          text="Sync Now"
          icon={SyncIcon}
          tone="primary"
          onClick={handleSync}
          disabled={loading}
          loading={loading}
        />
        <Text size={1} muted>
          Endpoint: {parent?.apiEndpoint || 'No endpoint set'}
        </Text>
        <Text size={1} muted>
          Current pricing plans: {parent?.pricingPlans?.length || 0}
        </Text>
        {loading && (
          <Text size={1} weight="semibold">
            Fetching data from API...
          </Text>
        )}
      </Stack>
    </Card>
  )
}