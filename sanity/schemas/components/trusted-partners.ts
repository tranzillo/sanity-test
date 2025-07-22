export default {
  name: 'trustedPartners',
  title: 'Trusted Partners',
  type: 'object',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'partners',
      title: 'Partner Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Company Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'logo',
              title: 'Logo',
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
              name: 'website',
              title: 'Website URL',
              type: 'url',
              description: 'Optional link to partner website',
            },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.min(1),
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
      partners: 'partners',
    },
    prepare(selection: any) {
      const { title, partners } = selection
      const partnerCount = partners?.length || 0
      return {
        title: title ? `Partners: ${title}` : 'Trusted Partners',
        subtitle: `${partnerCount} partner${partnerCount !== 1 ? 's' : ''}`,
      }
    },
  },
}