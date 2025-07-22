import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/lib/sanity-image'
import styles from './ThreeUpGrid.module.scss'

interface GridItem {
  image?: {
    asset?: unknown
    alt: string
  }
  headline: string
  text: string
  link?: {
    text: string
    url: string
    openInNewTab?: boolean
  }
}

interface ThreeUpGridProps {
  eyebrow?: string
  headline: string
  subheadline?: string
  items: GridItem[]
  alignment?: 'left' | 'center'
  theme?: 'light' | 'dark'
  _path?: string
}

export default function ThreeUpGrid({
  eyebrow,
  headline,
  subheadline,
  items,
  alignment = 'center',
  theme = 'light',
  _path,
}: ThreeUpGridProps) {
  const sectionClasses = [
    styles.section,
    styles[theme]
  ].join(' ')

  const headerClasses = [
    styles.header,
    styles[`align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`]
  ].join(' ')

  return (
    <section className={sectionClasses} data-sanity={_path}>
      <div className={styles.container}>
        <div className={headerClasses}>
          {eyebrow && (
            <p className={styles.eyebrow} data-sanity={_path ? `${_path}.eyebrow` : undefined}>
              {eyebrow}
            </p>
          )}
          
          <h2 className={styles.headline} data-sanity={_path ? `${_path}.headline` : undefined}>
            {headline}
          </h2>
          
          {subheadline && (
            <p className={styles.subheadline} data-sanity={_path ? `${_path}.subheadline` : undefined}>
              {subheadline}
            </p>
          )}
        </div>

        <div className={styles.grid} data-sanity={_path ? `${_path}.items` : undefined}>
          {items.map((item, index) => {
            const itemPath = _path ? `${_path}.items[${index}]` : undefined
            return (
              <div key={index} className={styles.gridItem} data-sanity={itemPath}>
                {item.image?.asset ? (
                  <div className={styles.itemImage} data-sanity={itemPath ? `${itemPath}.image` : undefined}>
                    <Image
                      src={urlForImage(item.image).width(400).height(250).url()}
                      alt={item.image.alt}
                      fill
                    />
                  </div>
                ) : null}
                
                <h3 className={styles.itemHeadline} data-sanity={itemPath ? `${itemPath}.headline` : undefined}>
                  {item.headline}
                </h3>
                
                <p className={styles.itemText} data-sanity={itemPath ? `${itemPath}.text` : undefined}>
                  {item.text}
                </p>
                
                {item.link?.url && item.link?.text && (
                  <Link
                    href={item.link.url}
                    target={item.link.openInNewTab ? '_blank' : undefined}
                    rel={item.link.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={styles.itemLink}
                    data-sanity={itemPath ? `${itemPath}.link` : undefined}
                  >
                    {item.link.text}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}