import React, { useState } from 'react'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { SyncIcon } from '@sanity/icons'
import { set, useFormValue, useToast, FormPatch } from 'sanity'

interface SyncButtonProps {
  onChange: (patches: FormPatch[]) => void
  path: (string | number)[]
}

export function SyncButton({ onChange, path }: SyncButtonProps) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const formValue = useFormValue([]) as any

  const handleSync = async () => {
    // Get the parent pricing section
    const parentPath = path.slice(0, -1)
    const pricingSection = formValue
    
    // Navigate to the pricing section using the path
    let current = pricingSection
    for (const segment of parentPath) {
      current = current?.[segment]
    }

    if (!current?.syncWithApi || !current?.apiEndpoint) {
      toast.push({
        status: 'warning',
        title: 'Sync not configured',
        description: 'Enable "Sync with API" and set an API endpoint first',
      })
      return
    }

    setLoading(true)

    try {
      console.log('Syncing from:', current.apiEndpoint)
      const response = await fetch(current.apiEndpoint)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const data = await response.json()
      
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

      // Update both pricing plans and last synced timestamp
      onChange([
        set(transformedPlans, [...parentPath, 'pricingPlans']),
        set(new Date().toISOString(), [...parentPath, 'lastSynced'])
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
  }

  return (
    <Card padding={3} tone="primary">
      <Stack space={3}>
        <Text weight="semibold">Sync Pricing Data</Text>
        <Button
          text={loading ? 'Syncing...' : 'Sync Now'}
          icon={SyncIcon}
          onClick={handleSync}
          disabled={loading}
          tone="primary"
        />
        <Text size={1} muted>
          Click to fetch pricing data from the API endpoint
        </Text>
      </Stack>
    </Card>
  )
}