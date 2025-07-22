import imageUrlBuilder from '@sanity/image-url'
import { sanityClientPublic } from './sanity-public'

const builder = imageUrlBuilder(sanityClientPublic)

export function urlForImage(source: unknown) {
  return builder.image(source)
}