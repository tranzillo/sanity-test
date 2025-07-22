export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines and social media',
      validation: (Rule: any) => Rule.max(60).warning('Titles over 60 characters may be truncated'),
    },
    {
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines and social media',
      validation: (Rule: any) => Rule.max(160).warning('Descriptions over 160 characters may be truncated'),
    },
    {
      name: 'image',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image used when page is shared on social media (1200x630px recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      description: 'Check to prevent search engines from indexing this page',
      initialValue: false,
    },
  ],
}