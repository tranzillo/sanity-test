import React, { useState, useCallback } from 'react'
import { Button, Card, Stack, Text, useToast } from '@sanity/ui'
import { SyncIcon } from '@sanity/icons'
import { ObjectInputProps, set } from 'sanity'

// This component receives the entire pricingSection object as its props
export default function FieldLevelSync(props: ObjectInputProps) {
  const { onChange, value } = props
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSync = useCallback(async () => {
    if (!value?.syncWithApi) {
      toast.push({
        status: 'warning',
        title: 'Sync not enabled',
        description: 'Enable "Sync with API" first',
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/sync-pricing', { method: 'POST' })
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Sync failed')
      }
      
      // Transform to match schema
      const transformedPlans = result.data.pricingPlans?.map((plan: any) => ({
        _type: 'pricingPlan',
        _key: plan._key || plan.id,
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billing: plan.billing || 'monthly',
        features: plan.features || [],
        highlighted: Boolean(plan.highlighted),
        ctaText: plan.ctaText || 'Get Started',
      })) || []
      
      // Use onChange to update the pricingPlans field
      onChange([
        set(transformedPlans, ['pricingPlans']),
        set(new Date().toISOString(), ['lastSynced'])
      ])
      
      toast.push({
        status: 'success',
        title: 'Sync Successful!',
        description: `Imported ${transformedPlans.length} pricing plans`,
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
  }, [value?.syncWithApi, onChange, toast])

  const planCount = value?.pricingPlans?.length || 0

  // Render the default form fields plus our sync button
  return (
    <Stack space={4}>
      {/* Render all the default fields */}
      {props.renderDefault(props)}
      
      {/* Add our sync button when sync is enabled */}
      {value?.syncWithApi && (
        <Card padding={3} tone="primary">
          <Stack space={3}>
            <Text weight="semibold">🔄 Sync Pricing Data</Text>
            
            <Text size={1} muted>
              Click to import pricing data from JSON file
            </Text>
            
            <Text size={1} muted>
              Current plans: {planCount}
            </Text>
            
            {value?.lastSynced && (
              <Text size={1} style={{ color: 'green' }}>
                Last synced: {new Date(value.lastSynced).toLocaleString()}
              </Text>
            )}
            
            <Button
              text={loading ? 'Syncing...' : 'Sync from JSON'}
              icon={SyncIcon}
              onClick={handleSync}
              disabled={loading}
              tone="primary"
            />
          </Stack>
        </Card>
      )}
    </Stack>
  )
}