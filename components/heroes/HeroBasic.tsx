import Image from 'next/image'
import { urlForImage } from '@/lib/sanity-image'
import styles from './HeroBasic.module.scss'

interface HeroBasicProps {
  headline: string
  subheadline?: string
  backgroundImage?: {
    asset?: any
    alt: string
  }
  backgroundColor?: string
  textColor?: 'white' | 'black'
  alignment?: 'left' | 'center' | 'right'
  height?: 'small' | 'medium' | 'large' | 'full'
  _path?: string
}

export default function HeroBasic({
  headline,
  subheadline,
  backgroundImage,
  backgroundColor = '#000000',
  textColor = 'white',
  alignment = 'center',
  height = 'medium',
  _path,
}: HeroBasicProps) {
  const heroClasses = [
    styles.hero,
    styles[height]
  ].join(' ')

  const contentClasses = [
    styles.content,
    styles[`align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`]
  ].join(' ')

  const headlineClasses = [
    styles.headline,
    styles[textColor]
  ].join(' ')

  const subheadlineClasses = [
    styles.subheadline,
    styles[textColor]
  ].join(' ')

  return (
    <section 
      className={heroClasses}
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
          <div className={styles.overlay} />
        </div>
      )}

      <div className={styles.container}>
        <div className={contentClasses}>
          <h1 className={headlineClasses} data-sanity={_path ? `${_path}.headline` : undefined}>
            {headline}
          </h1>
          
          {subheadline && (
            <p className={subheadlineClasses} data-sanity={_path ? `${_path}.subheadline` : undefined}>
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}