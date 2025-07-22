import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPageBySlug, getAllPageSlugs } from '@/lib/sanity-pages'
import { renderComponents } from '@/lib/component-renderer'
import { urlForImage } from '@/lib/sanity-image'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }
  
  const seoTitle = page.seo?.title || page.title
  const seoDescription = page.seo?.description
  const seoImage = page.seo?.image
  
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: seoImage ? [urlForImage(seoImage).width(1200).height(630).url()] : [],
    },
    robots: {
      index: !page.seo?.noIndex,
      follow: !page.seo?.noIndex,
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div>
      {renderComponents(page.content, page._id)}
    </div>
  )
}