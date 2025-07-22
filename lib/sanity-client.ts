import { draftMode } from 'next/headers'
import { sanityClient, sanityClientAuth } from './sanity'

export async function getSanityClient() {
  const { isEnabled } = await draftMode()
  return isEnabled ? sanityClientAuth : sanityClient
}