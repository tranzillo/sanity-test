import { sanityClient, sanityClientAuth } from './sanity'
import { draftMode } from 'next/headers'

export interface SanityPage {
  _id: string
  title: string
  slug: { current: string }
  isHomepage: boolean
  content: any[]
  seo?: {
    title?: string
    description?: string
    image?: any
    noIndex?: boolean
  }
  publishedAt: string
}

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    const query = `
      *[_type == "page" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        isHomepage,
        content,
        seo,
        publishedAt
      }
    `
    
    const page = await sanityClient.fetch(query, { slug })
    return page || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function getHomepage(): Promise<SanityPage | null> {
  const query = `
    *[_type == "page" && isHomepage == true][0] {
      _id,
      _type,
      title,
      slug,
      isHomepage,
      content[] {
        _type,
        _key,
        ...
      },
      seo,
      publishedAt,
      _updatedAt,
      _createdAt
    }
  `
  
  try {
    // Check if we're in draft mode
    const { isEnabled } = await draftMode()
    // console.log('🔍 Draft mode status:', isEnabled)
    
    if (isEnabled) {
      // When in draft mode, use authenticated client with stega enabled
      // console.log('🔍 Fetching with auth client, token exists:', !!process.env.SANITY_API_TOKEN)
      
      try {
        // First, let's test a simple query to see if auth works
        const testQuery = `*[_type == "page"][0]._id`
        const testResult = await sanityClientAuth.fetch(testQuery)
        // console.log('🔍 Test query result:', testResult)
        
        const page = await sanityClientAuth.fetch(
          query, 
          {},
          {
            useCdn: false,
            stega: true, // Enable stega encoding for visual editing
          }
        )
        console.log('✅ Homepage fetched with stega encoding:', page?._id)
        return page || null
      } catch (authError) {
        // console.error('🔍 Auth client error:', authError)
        // console.error('🔍 Error details:', authError instanceof Error ? authError.message : 'Unknown error')
        
        // Fallback to regular fetch with stega
        try {
          const page = await sanityClient.fetch(
            query,
            {},
            {
              stega: true,
              useCdn: false
            }
          )
          console.log('✅ Fallback fetch with stega:', page?._id)
          return page || null
        } catch (fallbackError) {
          console.error('🔍 Fallback error:', fallbackError)
          throw fallbackError
        }
      }
    } else {
      // Use public client for normal requests
      const page = await sanityClient.fetch(query)
      return page || null
    }
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const query = `
      *[_type == "page" && defined(slug.current) && !isHomepage] {
        "slug": slug.current
      }
    `
    
    const pages = await sanityClient.fetch(query)
    return pages.map((page: any) => page.slug)
  } catch (error) {
    console.error('Error fetching page slugs:', error)
    return []
  }
}

export async function getAllPages(): Promise<SanityPage[]> {
  try {
    const query = `
      *[_type == "page"] | order(isHomepage desc, title asc) {
        _id,
        title,
        slug,
        isHomepage,
        content,
        seo,
        publishedAt
      }
    `
    
    const pages = await sanityClient.fetch(query)
    return pages || []
  } catch (error) {
    console.error('Error fetching all pages:', error)
    return []
  }
}