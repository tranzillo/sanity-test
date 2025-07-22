'use client'

import { enableVisualEditing } from '@sanity/visual-editing'
import { useLiveMode } from '@sanity/react-loader'
import { sanityClient } from '@/lib/sanity'
import { useEffect } from 'react'

// Create a stega-enabled client for visual editing
const stegaClient = sanityClient.withConfig({
  stega: {
    enabled: true,
    studioUrl: '/studio'
  }
})

export default function SanityVisualEditing() {
  // Enable live mode for real-time updates
  useLiveMode({ client: stegaClient })
  
  useEffect(() => {
    // Only enable visual editing in draft mode or iframe (presentation tool)
    const isDraftMode = document.cookie.includes('__next_draft_mode')
    const isInIframe = window.self !== window.top
    
    if (isDraftMode || isInIframe) {
      const cleanup = enableVisualEditing({
        zIndex: 999999,
      })
      
      return () => cleanup()
    }
  }, [])
  
  return null
}