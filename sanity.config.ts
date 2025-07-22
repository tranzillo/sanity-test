import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {schemaTypes} from './sanity/schemas'
import {syncPricingAction} from './sanity/actions/syncPricingAction'

export default defineConfig({
  name: 'default',
  title: 'Plasmid Marketing Site',

  projectId: 'bvrcg8jz',
  dataset: 'production',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        }
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add sync action to page documents
      if (context.schemaType === 'page') {
        return [...prev, syncPricingAction]
      }
      return prev
    },
  },

  basePath: '/studio',
})

