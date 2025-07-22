'use client'

import { createClient } from '@sanity/client'

// Client-side authenticated client for visual editing
export const visualEditingClient = createClient({
  projectId: 'bvrcg8jz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'drafts',
  stega: {
    enabled: true,
    studioUrl: '/studio'
  }
})