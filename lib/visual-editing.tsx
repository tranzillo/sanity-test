import { stegaClean } from '@sanity/client/stega'

// Utility to clean stega-encoded strings for display
export function cleanStegaString(value: string): string {
  return stegaClean(value)
}

// Wrapper component for visual editing
export function VisualEditingWrapper({
  children,
  path,
  className,
}: {
  children: React.ReactNode
  path?: string
  className?: string
}) {
  return (
    <div
      data-sanity={path}
      className={className}
    >
      {children}
    </div>
  )
}

// Hook for visual editing attributes
export function useVisualEditingProps(path?: string) {
  return {
    'data-sanity': path,
  }
}