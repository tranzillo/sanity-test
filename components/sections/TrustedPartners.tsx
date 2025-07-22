import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/lib/sanity-image'
import styles from './TrustedPartners.module.scss'

interface Partner {
  name: string
  logo: {
    asset?: unknown
    alt: string
  }
  website?: string
}

interface TrustedPartnersProps {
  headline: string
  partners: Partner[]
  theme?: 'light' | 'dark'
  _path?: string
}

export default function TrustedPartners({
  headline,
  partners,
  theme = 'light',
  _path,
}: TrustedPartnersProps) {
  const sectionClasses = [
    styles.section,
    styles[theme]
  ].join(' ')

  const renderPartner = (partner: Partner, index: number) => {
    const partnerClasses = [
      styles.partnerItem,
      partner.website ? styles.hasLink : ''
    ].filter(Boolean).join(' ')
    
    const partnerPath = _path ? `${_path}.partners[${index}]` : undefined

    if (!partner.logo?.asset) {
      return null
    }

    const logoElement = (
      <Image
        src={urlForImage(partner.logo).width(320).height(160).url()}
        alt={partner.logo.alt}
        width={160}
        height={80}
        className={styles.partnerLogo}
        data-sanity={partnerPath ? `${partnerPath}.logo` : undefined}
      />
    )

    if (partner.website) {
      return (
        <Link
          key={index}
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className={partnerClasses}
          data-sanity={partnerPath}
        >
          {logoElement}
        </Link>
      )
    }

    return (
      <div key={index} className={partnerClasses} data-sanity={partnerPath}>
        {logoElement}
      </div>
    )
  }

  return (
    <section className={sectionClasses} data-sanity={_path}>
      <div className={styles.container}>
        <h2 className={styles.headline} data-sanity={_path ? `${_path}.headline` : undefined}>
          {headline}
        </h2>
        
        <div className={styles.partnersGrid} data-sanity={_path ? `${_path}.partners` : undefined}>
          {partners.map(renderPartner)}
        </div>
      </div>
    </section>
  )
}