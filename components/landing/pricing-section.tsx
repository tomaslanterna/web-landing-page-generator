import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Planes</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Precios simples y transparentes</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen acceso completo a la
              plataforma.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Básico</h3>
              <p className="text-gray-500 dark:text-gray-400">Perfecto para comenzar</p>
            </div>
            <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
              <span className="text-4xl font-bold">$0</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/mes</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>1 landing page</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Plantillas básicas</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Dominio personalizado</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Soporte por email</span>
              </li>
            </ul>
            <Button asChild className="mt-8">
              <Link href="/register">Comenzar gratis</Link>
            </Button>
          </div>
          <div className="flex flex-col rounded-lg border bg-primary p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary-foreground">Pro</h3>
              <p className="text-primary-foreground/80">Para profesionales</p>
            </div>
            <div className="mt-4 flex items-baseline text-primary-foreground">
              <span className="text-4xl font-bold">$29</span>
              <span className="ml-1 text-xl font-normal text-primary-foreground/80">/mes</span>
            </div>
            <ul className="mt-6 space-y-3 text-primary-foreground">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>10 landing pages</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Todas las plantillas</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Dominio personalizado</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Soporte prioritario</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                <span>Análisis avanzado</span>
              </li>
            </ul>
            <Button asChild className="mt-8 bg-white text-primary hover:bg-white/90">
              <Link href="/register">Comenzar prueba gratuita</Link>
            </Button>
          </div>
          <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Empresas</h3>
              <p className="text-gray-500 dark:text-gray-400">Para equipos grandes</p>
            </div>
            <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
              <span className="text-4xl font-bold">$99</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/mes</span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Landing pages ilimitadas</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Todas las plantillas</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Dominios personalizados</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Soporte 24/7</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Análisis avanzado</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Usuarios ilimitados</span>
              </li>
            </ul>
            <Button asChild className="mt-8" variant="outline">
              <Link href="/register">Contactar ventas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
