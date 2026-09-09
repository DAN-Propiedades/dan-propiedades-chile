import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BedDouble, Bath, Ruler, Trees, Car, MapPin, MessageCircle, Check } from "lucide-react";
import { formatUF, getProperty, SITE, whatsappLink } from "@/data/properties";

export const Route = createFileRoute("/propiedades/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Propiedad no disponible | Dan Propiedades" }, { name: "robots", content: "noindex" }],
      };
    }
    const { property } = loaderData;
    const title = `${property.titulo}, ${property.comuna} | Dan Propiedades`;
    const description = `${property.tipo} en venta en ${property.comuna}. ${property.construidosM2} m² construidos, ${property.habitaciones} habitaciones, ${property.banos} baños. ${formatUF(property.precioUF)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Ficha,
});

function Ficha() {
  const { property } = Route.useLoaderData();
  const mensaje = `Hola ${SITE.nombre}, me interesa la propiedad "${property.titulo}" en ${property.comuna} (${formatUF(property.precioUF)}).`;

  const datos = [
    { icon: Trees, label: "Terreno", valor: property.terrenoM2 ? `${property.terrenoM2} m²` : "—" },
    { icon: Ruler, label: "Construidos", valor: `${property.construidosM2} m²` },
    { icon: BedDouble, label: "Habitaciones", valor: String(property.habitaciones) },
    { icon: Bath, label: "Baños", valor: String(property.banos) },
    { icon: Car, label: "Estacionamientos", valor: String(property.estacionamientos ?? 0) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/propiedades" className="text-sm font-medium text-primary hover:underline">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl">
        <img
          src={property.imagen}
          alt={`${property.titulo} en ${property.comuna}`}
          width={1200}
          height={800}
          className="h-[280px] w-full object-cover sm:h-[460px]"
        />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {property.comuna}, {property.region}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            {property.titulo}
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{property.descripcion}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {datos.map((d) => (
              <div key={d.label} className="rounded-2xl border border-border bg-card p-4">
                <d.icon className="h-5 w-5 text-accent" />
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {d.label}
                </p>
                <p className="font-display text-lg font-semibold text-foreground">{d.valor}</p>
              </div>
            ))}
          </div>

          {property.caracteristicas?.length ? (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-foreground">Características</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {property.caracteristicas.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-accent" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">Precio de venta</p>
          <p className="font-display text-3xl font-bold text-primary">
            {formatUF(property.precioUF)}
          </p>
          <a
            href={whatsappLink(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </a>
          <Link
            to="/contacto"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Agendar una visita
          </Link>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {SITE.telefono} · {SITE.email}
          </p>
        </aside>
      </div>
    </div>
  );
}
