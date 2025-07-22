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
          <iframe
            src={url}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            className={styles.iframe}
            data-sanity={_path ? `${_path}.url` : undefined}
          />
        </div>
      </div>
    </section>
  )
}