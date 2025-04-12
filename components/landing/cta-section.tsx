import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Comienza a crear tu landing page hoy</h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Regístrate gratis y comienza a crear landing pages profesionales en minutos.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/register">Comenzar gratis</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-primary-foreground/10"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
