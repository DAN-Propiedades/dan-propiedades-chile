import { createFileRoute } from "@tanstack/react-router";
import { Compass, Target, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Visión y misión | Dan Propiedades" },
      {
        name: "description",
        content:
          "Conoce la visión, misión y valores de Dan Propiedades, corredora enfocada en la venta de propiedades en Chile.",
      },
      { property: "og:title", content: "Visión y misión | Dan Propiedades" },
      {
        property: "og:description",
        content: "La forma en que trabajamos: transparencia, cercanía y compromiso con cada cliente.",
      },
    ],
  }),
  component: Nosotros,
});

function Nosotros() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold text-foreground">Quiénes somos</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Dan Propiedades es una corredora chilena dedicada a la venta de casas, departamentos y
        terrenos. Trabajamos con pocas propiedades a la vez para conocerlas de verdad y poder
        recomendar con honestidad.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <article className="rounded-3xl bg-primary p-8 text-primary-foreground">
          <Compass className="h-8 w-8 text-accent" />
          <h2 className="mt-4 font-display text-2xl font-bold">Nuestra visión</h2>
          <p className="mt-3 text-primary-foreground/85">
            Ser la corredora de propiedades más confiable de Chile, reconocida por transformar una
            decisión compleja en una experiencia clara, humana y segura para cada familia.
          </p>
        </article>
        <article className="rounded-3xl border border-border bg-card p-8">
          <Target className="h-8 w-8 text-accent" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Nuestra misión</h2>
          <p className="mt-3 text-muted-foreground">
            Conectar a las personas con la propiedad correcta, entregando información completa y
            verificada, acompañamiento profesional en la negociación y total transparencia en cada
            etapa del proceso de compra.
          </p>
        </article>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-foreground">Nuestros valores</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            ["Transparencia", "Datos reales de superficie, precio y condiciones desde el primer día."],
            ["Cercanía", "Atención directa, sin call centers ni respuestas automáticas."],
            ["Compromiso", "Acompañamos hasta la firma y también después de ella."],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-2xl bg-secondary p-6">
              <HeartHandshake className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
