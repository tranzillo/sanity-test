import styles from './PricingSection.module.scss'

interface PricingPlan {
  id: string
  name: string
  description?: string
  price?: number
  billing: string
  features: string[]
  highlighted: boolean
  ctaText: string
}

interface PricingSectionProps {
  title?: string
  subtitle?: string
  pricingPlans: PricingPlan[]
  syncWithApi?: boolean
  _path?: string
}

export default function PricingSection({
  title = 'Choose Your Plan',
  subtitle = 'Select the perfect plan for your needs',
  pricingPlans = [],
  syncWithApi = false,
  _path,
}: PricingSectionProps) {
  return (
    <section className={styles.pricingSection} data-sanity={_path}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title} data-sanity={_path ? `${_path}.title` : undefined}>
            {title}
          </h2>
          {subtitle && (
            <p className={styles.subtitle} data-sanity={_path ? `${_path}.subtitle` : undefined}>
              {subtitle}
            </p>
          )}
          {syncWithApi && (
            <div className={styles.syncIndicator}>
              <span className={styles.syncBadge}>🔄 Synced with API</span>
            </div>
          )}
        </div>

        <div className={styles.plansGrid}>
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
              data-sanity={_path ? `${_path}.pricingPlans[${index}]` : undefined}
            >
              {plan.highlighted && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}
              
              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                {plan.description && (
                  <p className={styles.planDescription}>{plan.description}</p>
                )}
              </div>

              <div className={styles.planPrice}>
                {plan.price ? (
                  <>
                    <span className={styles.currency}>$</span>
                    <span className={styles.amount}>{plan.price}</span>
                    <span className={styles.period}>/{plan.billing}</span>
                  </>
                ) : (
                  <span className={styles.customPrice}>Custom</span>
                )}
              </div>

              <ul className={styles.featuresList}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.feature}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`${styles.ctaButton} ${
                  plan.highlighted ? styles.primaryButton : styles.secondaryButton
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}