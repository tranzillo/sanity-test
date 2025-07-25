import FieldLevelSync from '../../components/FieldLevelSync'

export default {
  name: 'pricingSection',
  title: 'Pricing Section',
  type: 'object',
  components: {
    input: FieldLevelSync
  },
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Choose Your Plan',
    },
    {
      name: 'subtitle',
      title: 'Section Subtitle',
      type: 'string',
      initialValue: 'Select the perfect plan for your needs',
    },
    {
      name: 'syncWithApi',
      title: 'Sync with API',
      type: 'boolean',
      description: 'When enabled, pricing data will be synced from the API and fields will be read-only',
      initialValue: false,
    },
    {
      name: 'lastSynced',
      title: 'Last Synced',
      type: 'datetime',
      readOnly: true,
      hidden: ({ parent }: any) => !parent?.syncWithApi,
    },
    {
      name: 'pricingPlans',
      title: 'Pricing Plans',
      type: 'array',
      description: 'When "Sync with API" is enabled, use the sync button to populate these fields. When disabled, you can manually edit these plans.',
      readOnly: ({ parent }: any) => parent?.syncWithApi,
      of: [
        {
          type: 'object',
          name: 'pricingPlan',
          title: 'Pricing Plan',
          fields: [
            {
              name: 'id',
              title: 'Plan ID',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'name',
              title: 'Plan Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
              description: 'Leave empty for custom pricing',
            },
            {
              name: 'billing',
              title: 'Billing Period',
              type: 'string',
              options: {
                list: [
                  { title: 'Monthly', value: 'monthly' },
                  { title: 'Yearly', value: 'yearly' },
                  { title: 'Custom', value: 'custom' },
                ],
              },
              initialValue: 'monthly',
            },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'highlighted',
              title: 'Highlight this plan',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'ctaText',
              title: 'Call to Action Text',
              type: 'string',
              initialValue: 'Get Started',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
              billing: 'billing',
            },
            prepare(selection: any) {
              const { title, subtitle, billing } = selection
              return {
                title,
                subtitle: subtitle ? `$${subtitle}/${billing}` : 'Custom pricing',
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      syncEnabled: 'syncWithApi',
    },
    prepare(selection: any) {
      const { title, syncEnabled } = selection
      return {
        title: title || 'Pricing Section',
        subtitle: syncEnabled ? '🔄 Synced with API' : '✏️ Manual data',
      }
    },
  },
}