import { NextResponse } from "next/server"

// Reference to the previewStore from the route.ts file
// In a real application, you would use a proper database or cache
import { previewStore } from "./store"

// Cleanup function to remove old previews
export async function cleanupPreviews() {
  const now = Date.now()
  const expirationTime = 30 * 60 * 1000 // 30 minutes in milliseconds

  Object.keys(previewStore).forEach((previewId) => {
    const preview = previewStore[previewId]
    if (preview.createdAt && now - preview.createdAt > expirationTime) {
      delete previewStore[previewId]
    }
  })
}

// API route to manually trigger cleanup
export async function GET() {
  await cleanupPreviews()
  return NextResponse.json({ success: true })
}

