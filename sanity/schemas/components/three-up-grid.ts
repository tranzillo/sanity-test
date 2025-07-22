export default {
  name: 'threeUpGrid',
  title: 'Three-Up Grid',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small text above the headline',
    },
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
    },
    {
      name: 'items',
      title: 'Grid Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
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
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 4,
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'openInNewTab',
                  title: 'Open in New Tab',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'headline',
              subtitle: 'text',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.length(3).error('Must have exactly 3 items'),
    },
    {
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
      initialValue: 'center',
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
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subheadline',
      items: 'items',
    },
    prepare(selection: any) {
      const { title, subtitle, items } = selection
      const itemCount = items?.length || 0
      return {
        title: title ? `Grid: ${title}` : 'Three-Up Grid',
        subtitle: subtitle || `${itemCount} items`,
      }
    },
  },
}