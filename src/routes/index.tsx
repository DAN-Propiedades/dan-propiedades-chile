import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Handshake, Search } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { whatsappLink } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { listPropiedades } from "@/lib/propiedades.functions";

export const Route = createFileRoute("/")({
  loader: () => listPropiedades(),
  head: () => ({
    meta: [
      { title: "Dan Propiedades | Casas y departamentos en venta en Chile" },
      {
        name: "description",
        content:
          "Propiedades en venta en Chile: casas, departamentos y terrenos con precios en UF, fichas detalladas y asesoría directa por WhatsApp.",
      },
      { property: "og:title", content: "Dan Propiedades | Propiedades en venta en Chile" },
      {
        property: "og:description",
        content: "Catálogo de casas y departamentos en venta con precios en UF y atención personalizada.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const properties = Route.useLoaderData();
  const destacadas = properties.filter((p) => p.destacada).slice(0, 3);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Casa moderna en venta con vista a la cordillera en Chile"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="font-medium uppercase tracking-[0.2em] text-accent">
            Corredores de Propiedades
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-6xl">
            Encuentra la propiedad donde empieza tu próxima etapa
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
            Casas, departamentos y terrenos seleccionados en todo Chile, con información clara,
            precios en UF y acompañamiento en cada paso de la compra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/propiedades"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Ver propiedades
            </Link>
            <a
              href={whatsappLink("Hola Dan Propiedades, quiero asesoría para comprar una propiedad.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <MessageCircle className="h-4 w-4" /> Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Propiedades destacadas
            </h2>
            <p className="mt-2 text-muted-foreground">Una selección de nuestro catálogo actual.</p>
          </div>
          <Link to="/propiedades" className="font-semibold text-primary hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacadas.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              titulo: "Información transparente",
              texto: "Cada ficha incluye metros de terreno, construidos y precio en UF, sin letra chica.",
            },
            {
              icon: Handshake,
              titulo: "Asesoría cercana",
              texto: "Te acompañamos desde la primera visita hasta la firma de la escritura.",
            },
            {
              icon: MessageCircle,
              titulo: "Respuesta rápida",
              texto: "Contáctanos por WhatsApp y coordina una visita el mismo día.",
            },
          ].map((item) => (
            <div key={item.titulo} className="rounded-2xl bg-card p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {item.titulo}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
