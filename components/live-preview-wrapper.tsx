'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface LivePreviewWrapperProps {
  children: React.ReactNode
  enabled: boolean
}

export function LivePreviewWrapper({ children, enabled }: LivePreviewWrapperProps) {
  const router = useRouter()
  
  useEffect(() => {
    if (!enabled) return
    
    // Create a refresh function
    const handleRefresh = () => {
      router.refresh()
    }
    
    // Listen for Sanity Studio messages
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from Sanity Studio
      if (event.data?.source === 'sanity-studio' || event.data?.type === 'content-update') {
        handleRefresh()
      }
    }
    
    // Add event listener
    window.addEventListener('message', handleMessage)
    
    // Also listen for focus events to refresh when switching back to preview
    const handleFocus = () => {
      if (document.hasFocus()) {
        handleRefresh()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('focus', handleFocus)
      // clearInterval(interval)
    }
  }, [enabled, router])
  
  return <>{children}</>
}