// This is a server component that will render the preview
export default async function PreviewPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the settings from a database
  // For this example, we'll redirect to the API route
  return (
    <div className="w-full h-screen">
      <iframe src={`/api/preview?id=${params.id}`} className="w-full h-full border-0" title="Landing Page Preview" />
    </div>
  )
}

