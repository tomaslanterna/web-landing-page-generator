export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-white px-3 py-1 text-sm dark:bg-gray-900">Testimonios</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Lo que dicen nuestros usuarios</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Miles de usuarios confían en nuestra plataforma para crear sus landing pages.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "Increíble herramienta. Pude crear una landing page profesional en menos de una hora sin tener
                conocimientos de diseño."
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <p className="font-medium">Ana Rodríguez</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Emprendedora</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "La facilidad de uso y la calidad de las plantillas son impresionantes. Definitivamente recomendaría
                esta plataforma."
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <p className="font-medium">Carlos Méndez</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "Hemos aumentado nuestra tasa de conversión en un 30% desde que empezamos a usar esta plataforma para
                nuestras landing pages."
              </p>
            </div>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              <div>
                <p className="font-medium">Laura Torres</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">CEO, StartupX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
