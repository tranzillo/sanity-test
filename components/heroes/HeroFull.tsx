import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/lib/sanity-image'
import styles from './HeroFull.module.scss'

interface Button {
  text: string
  link: string
  style: 'primary' | 'secondary' | 'outline'
  openInNewTab?: boolean
}

interface HeroFullProps {
  eyebrow?: string
  headline: string
  subheadline?: string
  buttons?: Button[]
  image?: {
    asset?: unknown
    alt: string
  }
  alignment?: 'left' | 'center' | 'right'
  theme?: 'light' | 'dark'
  _path?: string
}

export default function HeroFull({
  eyebrow,
  headline,
  subheadline,
  buttons = [],
  image,
  alignment = 'left',
  theme = 'light',
}: HeroFullProps) {
  const heroClasses = [
    styles.hero,
    styles[theme]
  ].join(' ')

  const contentClasses = [
    styles.content,
    image ? styles.withImage : styles.withoutImage
  ].join(' ')

  const textContentClasses = [
    styles.textContent,
    styles[`align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`]
  ].join(' ')

  return (
    <section className={heroClasses}>
      <div className={styles.container}>
        <div className={contentClasses}>
          <div className={textContentClasses}>
            {eyebrow && (
              <p className={styles.eyebrow}>
                {eyebrow}
              </p>
            )}
            
            <h1 className={styles.headline}>
              {headline}
            </h1>
            
            {subheadline && (
              <p className={styles.subheadline}>
                {subheadline}
              </p>
            )}
            
            {buttons.length > 0 && (
              <div className={styles.buttons}>
                {buttons.map((button, index) => (
                  <Link
                    key={index}
                    href={button.link}
                    target={button.openInNewTab ? '_blank' : undefined}
                    rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={`${styles.button} ${styles[button.style]}`}
                  >
                    {button.text}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {image && (
            <div className={styles.imageContainer}>
              <Image
                src={urlForImage(image).url()}
                alt={image.alt}
                fill
                className={styles.image}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}