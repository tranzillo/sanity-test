export default {
  name: 'sparklineEmbed',
  title: 'Sparkline Embed',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional title to display above the sparkline chart',
    },
    {
      name: 'url',
      title: 'Sparkline URL',
      type: 'url',
      description: 'URL of the sparkline chart to embed',
      initialValue: 'https://cgoaupomtlt4zyb33k7ywzsuvy0upezc.lambda-url.us-west-2.on.aws/sparkline/X89F7Y_1/1',
      validation: (Rule: any) => Rule.required().uri({
        scheme: ['http', 'https']
      })
    },
    {
      name: 'height',
      title: 'Height (pixels)',
      type: 'number',
      description: 'Height of the embedded iframe in pixels',
      initialValue: 400,
      validation: (Rule: any) => Rule.min(200).max(1000)
    }
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url'
    },
    prepare(selection: any) {
      const { title, url } = selection
      return {
        title: title || 'Sparkline Embed',
        subtitle: url ? new URL(url).pathname : 'No URL provided'
      }
    }
  }
}