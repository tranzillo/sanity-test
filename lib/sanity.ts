import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bvrcg8jz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Main client for Next.js - handles both public and authenticated requests
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio'
  }
})

// Client with auth token for server-side operations
export const sanityClientAuth = sanityClient.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})