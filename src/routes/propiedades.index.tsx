import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/propiedades/")({
  head: () => ({
    meta: [
      { title: "Catálogo de propiedades en venta | Dan Propiedades" },
      {
        name: "description",
        content:
          "Explora casas, departamentos y terrenos en venta en Chile con metros cuadrados, habitaciones, baños y precio en UF.",
      },
      { property: "og:title", content: "Catálogo de propiedades | Dan Propiedades" },
      {
        property: "og:description",
        content: "Casas y departamentos en venta en Chile con fichas completas y precio en UF.",
      },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const [tipo, setTipo] = useState<string>("Todas");
  const [comuna, setComuna] = useState<string>("Todas");

  const tipos = ["Todas", ...new Set(properties.map((p) => p.tipo))];
  const comunas = ["Todas", ...new Set(properties.map((p) => p.comuna))];

  const lista = useMemo(
    () =>
      properties.filter(
        (p) => (tipo === "Todas" || p.tipo === tipo) && (comuna === "Todas" || p.comuna === comuna),
      ),
    [tipo, comuna],
  );

  const selectClass =
    "rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">Propiedades en venta</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Filtra por tipo o comuna y revisa la ficha de cada propiedad con superficie, programa y
        precio en UF.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="tipo">
          Tipo de propiedad
        </label>
        <select
          id="tipo"
          className={selectClass}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="comuna">
          Comuna
        </label>
        <select
          id="comuna"
          className={selectClass}
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
        >
          {comunas.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {lista.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          No hay propiedades que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
