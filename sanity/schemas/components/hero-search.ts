export default {
  name: 'heroSearch',
  title: 'Hero - Search',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'searchPlaceholder',
      title: 'Search Placeholder Text',
      type: 'string',
      initialValue: 'Search resources...',
    },
    {
      name: 'searchEndpoint',
      title: 'Search Endpoint',
      type: 'string',
      description: 'API endpoint or page to handle search (e.g., /api/search or /search)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color code (e.g., #f3f4f6) - used if no background image',
      initialValue: '#f3f4f6',
    },
    {
      name: 'theme',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
      initialValue: 'light',
    },
    {
      name: 'searchCategories',
      title: 'Search Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Optional categories to filter search results',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'backgroundImage',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection
      return {
        title: title ? `Search Hero: ${title}` : 'Hero - Search',
        subtitle,
        media,
      }
    },
  },
}