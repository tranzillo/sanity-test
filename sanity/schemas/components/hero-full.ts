export default {
  name: 'heroFull',
  title: 'Hero - Full',
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
      name: 'buttons',
      title: 'Call to Action Buttons',
      type: 'array',
      of: [{ type: 'button' }],
      validation: (Rule: any) => Rule.max(2),
    },
    {
      name: 'image',
      title: 'Hero Image',
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
      name: 'alignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
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
      media: 'image',
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection
      return {
        title: title ? `Hero: ${title}` : 'Hero - Full',
        subtitle,
        media,
      }
    },
  },
}