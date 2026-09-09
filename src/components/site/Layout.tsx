import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, MessageCircle, Mail, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/data/properties";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/propiedades", label: "Propiedades" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
            DP
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight text-foreground">
            Dan Propiedades
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href={whatsappLink("Hola Dan Propiedades, quiero información sobre sus propiedades.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <button
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{SITE.nombre}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Corretaje de propiedades en Chile. Venta de casas, departamentos y terrenos con
            asesoría cercana y transparente.
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Contacto</p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> {SITE.telefono}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> {SITE.email}
          </p>
          <p>{SITE.direccion}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Navegación</p>
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block text-muted-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hola Dan Propiedades, me gustaría hablar con un asesor.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
