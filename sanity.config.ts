import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Sanity Test',

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


  basePath: '/studio',
})

