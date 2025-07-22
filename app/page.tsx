import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getHomepage } from '@/lib/sanity-pages'
import { renderComponents } from '@/lib/component-renderer'
import { urlForImage } from '@/lib/sanity-image'
import { LivePreviewWrapper } from '@/components/live-preview-wrapper'

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage()
  
  if (homepage?.seo) {
    const seoTitle = homepage.seo.title || homepage.title
    const seoDescription = homepage.seo.description
    const seoImage = homepage.seo.image
    
    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        images: seoImage ? [urlForImage(seoImage).width(1200).height(630).url()] : [],
      },
      robots: {
        index: !homepage.seo.noIndex,
        follow: !homepage.seo.noIndex,
      },
    }
  }
  
  return {
    title: 'Sanity-Test',
    description: 'Create beautiful, performant websites with Next.js and Sanity CMS.',
  }
}

export default async function HomePage() {
  const homepage = await getHomepage()
  const { isEnabled: isDraftMode } = await draftMode()
  
  // If we have CMS content, use it
  if (homepage && homepage.content && homepage.content.length > 0) {
    return (
      <LivePreviewWrapper enabled={isDraftMode}>
        <div>
          {renderComponents(homepage.content, homepage._id)}
        </div>
      </LivePreviewWrapper>
    )
  }
  
  // Show a message if no content is found
  if (homepage && (!homepage.content || homepage.content.length === 0)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Homepage found but no content</h1>
        <p>Go to Sanity Studio and add some content to your homepage.</p>
      </div>
    )
  }
  
  // No homepage found
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>No homepage configured</h1>
      <p>Go to Sanity Studio and create a page with &quot;Is Homepage&quot; checked.</p>
    </div>
  )
}