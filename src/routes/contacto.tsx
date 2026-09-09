import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SITE, whatsappLink } from "@/data/properties";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | Dan Propiedades" },
      {
        name: "description",
        content:
          "Escríbenos para coordinar visitas o resolver dudas sobre propiedades en venta en Chile. Atención por WhatsApp, teléfono y correo.",
      },
      { property: "og:title", content: "Contacto | Dan Propiedades" },
      {
        property: "og:description",
        content: "Coordina una visita o consulta por WhatsApp con Dan Propiedades.",
      },
    ],
  }),
  component: Contacto,
});

const schema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(80, "Nombre demasiado largo"),
  email: z.string().trim().email("Correo inválido").max(255),
  telefono: z.string().trim().max(30).optional(),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más").max(1000, "Máximo 1000 caracteres"),
});

function Contacto() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const texto = `Hola ${SITE.nombre}, soy ${d.nombre}.\n${d.mensaje}\nCorreo: ${d.email}${d.telefono ? `\nTeléfono: ${d.telefono}` : ""}`;
    window.open(whatsappLink(texto), "_blank", "noopener,noreferrer");
    toast.success("Abrimos WhatsApp con tu mensaje listo para enviar.");
    e.currentTarget.reset();
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-display text-4xl font-bold text-foreground">Conversemos</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Déjanos tu mensaje y te responderemos a la brevedad, o escríbenos directo por WhatsApp.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <div>
            <label htmlFor="nombre" className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <input id="nombre" name="nombre" maxLength={80} className={`mt-1 ${inputClass}`} />
            {errors.nombre && <p className="mt-1 text-xs text-destructive">{errors.nombre}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo
              </label>
              <input id="email" name="email" type="email" maxLength={255} className={`mt-1 ${inputClass}`} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="telefono" className="text-sm font-medium text-foreground">
                Teléfono (opcional)
              </label>
              <input id="telefono" name="telefono" maxLength={30} className={`mt-1 ${inputClass}`} />
            </div>
          </div>
          <div>
            <label htmlFor="mensaje" className="text-sm font-medium text-foreground">
              Mensaje
            </label>
            <textarea id="mensaje" name="mensaje" rows={5} maxLength={1000} className={`mt-1 ${inputClass}`} />
            {errors.mensaje && <p className="mt-1 text-xs text-destructive">{errors.mensaje}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Enviar mensaje
          </button>
        </form>

        <aside className="space-y-4">
          <a
            href={whatsappLink("Hola Dan Propiedades, quiero coordinar una visita.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-accent p-5 font-semibold text-accent-foreground"
          >
            <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
          </a>
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {SITE.telefono}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {SITE.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {SITE.direccion}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
