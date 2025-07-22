'use client'

import { useEffect, useState } from 'react'
import styles from './SparklineEmbed.module.scss'

interface SparklineEmbedProps {
  url?: string
  title?: string
  height?: number
  _path?: string
}

export default function SparklineEmbed({
  url = 'https://cgoaupomtlt4zyb33k7ywzsuvy0upezc.lambda-url.us-west-2.on.aws/sparkline/X89F7Y_1/1',
  title = 'Sparkline Chart',
  height = 400,
  _path,
}: SparklineEmbedProps) {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleIframeError = () => {
    setError('Failed to load sparkline chart')
  }

  if (!mounted) {
    return (
      <section className={styles.sparklineEmbed} data-sanity={_path}>
        <div className={styles.container}>
          {title && (
            <h2 className={styles.title} data-sanity={_path ? `${_path}.title` : undefined}>
              {title}
            </h2>
          )}
          <div 
            className={styles.iframeWrapper}
            style={{ height: `${height}px` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
              Loading chart...
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.sparklineEmbed} data-sanity={_path}>
        <div className={styles.container}>
          {title && (
            <h2 className={styles.title} data-sanity={_path ? `${_path}.title` : undefined}>
              {title}
            </h2>
          )}
          <div 
            className={styles.iframeWrapper}
            style={{ height: `${height}px` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
              {error}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.sparklineEmbed} data-sanity={_path}>
      <div className={styles.container}>
        {title && (
          <h2 className={styles.title} data-sanity={_path ? `${_path}.title` : undefined}>
            {title}
          </h2>
        )}
        <div 
          className={styles.iframeWrapper}
          style={{ height: `${height}px` }}
          data-sanity={_path ? `${_path}.url` : undefined}
        >
          <iframe
            src={url}
            title={title}
            width="100%"
            height="100%"
            className={styles.iframe}
            style={{ border: 'none' }}
            onError={handleIframeError}
          />
        </div>
      </div>
    </section>
  )
}