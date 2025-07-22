export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isHomepage',
      title: 'Is Homepage',
      type: 'boolean',
      description: 'Check if this is the homepage (only one page can be the homepage)',
      initialValue: false,
    },
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        { type: 'heroFull' },
        { type: 'heroBasic' },
        { type: 'heroSearch' },
        { type: 'trustedPartners' },
        { type: 'threeUpGrid' },
        { type: 'pricingSection' },
      ],
      description: 'Add and arrange components to build your page',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      isHomepage: 'isHomepage',
      content: 'content',
    },
    prepare(selection: any) {
      const { title, slug, isHomepage, content } = selection
      const componentCount = content?.length || 0
      return {
        title: isHomepage ? `🏠 ${title}` : title,
        subtitle: `/${slug || 'no-slug'} • ${componentCount} component${componentCount !== 1 ? 's' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Homepage First',
      name: 'homepageFirst',
      by: [
        { field: 'isHomepage', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Recently Updated',
      name: 'updatedDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],
}