import { CheckCircle2 } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              Características principales
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Todo lo que necesitas para crear landing pages
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Nuestra plataforma te ofrece todas las herramientas necesarias para crear landing pages profesionales sin
              necesidad de conocimientos técnicos.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Diseño intuitivo</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Interfaz de arrastrar y soltar para crear landing pages sin escribir código.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Plantillas profesionales</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Accede a decenas de plantillas diseñadas por profesionales para cualquier industria.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Despliegue con un clic</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Publica tu landing page en segundos con nuestro sistema de despliegue automático.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Optimización SEO</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Herramientas integradas para mejorar el posicionamiento de tu landing page en buscadores.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Formularios personalizados</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Crea formularios de captura de leads adaptados a tus necesidades específicas.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Análisis de rendimiento</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Estadísticas detalladas sobre el comportamiento de los visitantes en tu landing page.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

