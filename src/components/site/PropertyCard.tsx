import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatUF, imageOf, type Property } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      to="/propiedades/$id"
      params={{ id: property.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={imageOf(property)}
          alt={`${property.tipo} en ${property.comuna}: ${property.titulo}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          {property.tipo}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {property.comuna}, {property.region}
          </span>
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
          {property.titulo}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{property.descripcion}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {property.habitaciones}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" /> {property.banos}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4" /> {property.construidosM2} m²
          </span>
        </div>
        <p className="font-display text-xl font-bold text-primary">
          {formatUF(property.precioUF)}
        </p>
      </div>
    </Link>
  );
}
