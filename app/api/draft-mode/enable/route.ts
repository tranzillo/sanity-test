import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Enable draft mode without checking the secret
  // The presentation tool handles authentication
  const draft = await draftMode()
  draft.enable()

  // Get the redirect path from query params
  const url = new URL(request.url)
  const pathname = url.searchParams.get('sanity-preview-pathname') || '/'

  // Redirect to the path
  redirect(pathname)
}