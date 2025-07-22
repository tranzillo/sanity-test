import imageUrlBuilder from '@sanity/image-url'
import { sanityClientPublic } from './sanity-public'

const builder = imageUrlBuilder(sanityClientPublic)

export function urlForImage(source: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any)
}