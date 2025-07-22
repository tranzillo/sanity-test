'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { urlForImage } from '@/lib/sanity-image'
import styles from './HeroSearch.module.scss'

interface SearchCategory {
  label: string
  value: string
}

interface HeroSearchProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  searchEndpoint: string
  backgroundImage?: {
    asset?: any
    alt: string
  }
  backgroundColor?: string
  theme?: 'light' | 'dark'
  searchCategories?: SearchCategory[]
  _path?: string
}

export default function HeroSearch({
  title,
  subtitle,
  searchPlaceholder = 'Search resources...',
  searchEndpoint,
  backgroundImage,
  backgroundColor = '#f3f4f6',
  theme = 'light',
  searchCategories = [],
  _path,
}: HeroSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const overlayClasses = [
    styles.overlay,
    styles[theme]
  ].join(' ')

  const titleClasses = [
    styles.title,
    styles[theme]
  ].join(' ')

  const subtitleClasses = [
    styles.subtitle,
    styles[theme]
  ].join(' ')

  const categorySelectClasses = [
    styles.categorySelect,
    styles[theme]
  ].join(' ')

  const searchInputClasses = [
    styles.searchInput,
    styles[theme]
  ].join(' ')

  const searchButtonClasses = [
    styles.searchButton,
    styles[theme]
  ].join(' ')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchQuery)
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }
      router.push(`${searchEndpoint}?${params.toString()}`)
    }
  }

  return (
    <section 
      className={styles.hero}
      style={{ backgroundColor: !backgroundImage ? backgroundColor : undefined }}
      data-sanity={_path}
    >
      {backgroundImage && (
        <div className={styles.backgroundImage} data-sanity={_path ? `${_path}.backgroundImage` : undefined}>
          <Image
            src={urlForImage(backgroundImage).url()}
            alt={backgroundImage.alt}
            fill
            priority
          />
          <div className={overlayClasses} />
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={titleClasses} data-sanity={_path ? `${_path}.title` : undefined}>
            {title}
          </h1>
          
          {subtitle && (
            <p className={subtitleClasses} data-sanity={_path ? `${_path}.subtitle` : undefined}>
              {subtitle}
            </p>
          )}

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              {searchCategories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={categorySelectClasses}
                >
                  <option value="">All Categories</option>
                  {searchCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              )}
              
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={searchInputClasses}
                />
                <button
                  type="submit"
                  className={styles.searchIconButton}
                  aria-label="Search"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              <button
                type="submit"
                className={searchButtonClasses}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}