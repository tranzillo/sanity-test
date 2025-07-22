import { sanityClientAuth } from './sanity'

// Client for live queries during presentation mode
export const sanityClientLive = sanityClientAuth.withConfig({
  // Enable live queries
  perspective: 'drafts', // Updated from deprecated 'previewDrafts'
  useCdn: false,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
})