import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2, Upload, LogOut, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatUF, TIPOS, defaultImage } from "@/data/properties";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | Dan Propiedades" },
      { name: "description", content: "Panel privado para gestionar las propiedades publicadas." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel de administración | Dan Propiedades" },
      { property: "og:description", content: "Gestión de propiedades de Dan Propiedades." },
    ],
  }),
  component: AdminPage,
});

type Fila = {
  id: string;
  slug: string;
  titulo: string;
  comuna: string;
  region: string;
  tipo: string;
  descripcion: string;
  terreno_m2: number;
  construidos_m2: number;
  habitaciones: number;
  banos: number;
  estacionamientos: number;
  precio_uf: number;
  imagen_url: string | null;
  caracteristicas: string[];
  destacada: boolean;
  publicada: boolean;
};

const vacia = {
  slug: "",
  titulo: "",
  comuna: "",
  region: "Región Metropolitana",
  tipo: "Casa",
  descripcion: "",
  terreno_m2: 0,
  construidos_m2: 0,
  habitaciones: 0,
  banos: 0,
  estacionamientos: 0,
  precio_uf: 0,
  imagen_url: null as string | null,
  caracteristicas: [] as string[],
  destacada: false,
  publicada: true,
};

const slugify = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function AdminPage() {
  const navigate = useNavigate();
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<(typeof vacia & { id?: string }) | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data: rol } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setEsAdmin(Boolean(rol));
      if (rol) await cargar();
      setCargando(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargar() {
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("No pudimos cargar las propiedades");
      return;
    }
    const lista = (data ?? []) as unknown as Fila[];
    setFilas(lista);
    const urls: Record<string, string> = {};
    await Promise.all(
      lista.map(async (f) => {
        if (!f.imagen_url) return;
        if (f.imagen_url.startsWith("http")) {
          urls[f.id] = f.imagen_url;
          return;
        }
        const { data: signed } = await supabase.storage
          .from("propiedades")
          .createSignedUrl(f.imagen_url, 3600);
        if (signed?.signedUrl) urls[f.id] = signed.signedUrl;
      }),
    );
    setPreviews(urls);
  }

  async function subirFoto(file: File) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const ruta = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("propiedades").upload(ruta, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      toast.error("No se pudo subir la foto: " + error.message);
      return null;
    }
    return ruta;
  }

  async function guardar() {
    if (!editando) return;
    const slug = editando.slug || slugify(editando.titulo);
    if (!editando.titulo || !editando.comuna) {
      toast.error("El título y la comuna son obligatorios");
      return;
    }
    setGuardando(true);
    const payload = { ...editando, slug };
    delete (payload as { id?: string }).id;
    const { error } = editando.id
      ? await supabase.from("propiedades").update(payload).eq("id", editando.id)
      : await supabase.from("propiedades").insert(payload);
    setGuardando(false);
    if (error) {
      toast.error("No se pudo guardar: " + error.message);
      return;
    }
    toast.success("Propiedad guardada");
    setEditando(null);
    await cargar();
  }

  async function alternarPublicada(fila: Fila) {
    const { error } = await supabase
      .from("propiedades")
      .update({ publicada: !fila.publicada })
      .eq("id", fila.id);
    if (error) { toast.error("No se pudo cambiar la visibilidad"); return; }
    toast.success(fila.publicada ? "Propiedad oculta del sitio" : "Propiedad publicada");
    await cargar();
  }

  async function alternarDestacada(fila: Fila) {
    const { error } = await supabase
      .from("propiedades")
      .update({ destacada: !fila.destacada })
      .eq("id", fila.id);
    if (error) { toast.error("No se pudo cambiar el destacado"); return; }
    await cargar();
  }

  async function eliminar(fila: Fila) {
    if (!confirm(`¿Eliminar definitivamente "${fila.titulo}"?`)) return;
    const { error } = await supabase.from("propiedades").delete().eq("id", fila.id);
    if (error) { toast.error("No se pudo eliminar"); return; }
    toast.success("Propiedad eliminada");
    await cargar();
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const resumen = useMemo(
    () => ({
      total: filas.length,
      publicadas: filas.filter((f) => f.publicada).length,
    }),
    [filas],
  );

  if (cargando) {
    return <div className="mx-auto max-w-6xl px-5 py-20 text-muted-foreground">Cargando…</div>;
  }

  if (esAdmin === false) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-display text-2xl font-bold text-foreground">Sin permisos</h1>
        <p className="mt-3 text-muted-foreground">
          Esta cuenta no tiene permisos de administrador. Ingresa con la cuenta del propietario del
          sitio.
        </p>
        <button onClick={cerrarSesion} className="mt-6 text-sm font-medium text-primary hover:underline">
          Cerrar sesión
        </button>
      </div>
    );
  }

  const input = "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Panel de propiedades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {resumen.total} propiedades · {resumen.publicadas} visibles en el sitio
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditando({ ...vacia })}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <Plus className="h-4 w-4" /> Nueva propiedad
          </button>
          <button
            onClick={cerrarSesion}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-secondary p-5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <Info className="h-4 w-4" /> Cómo usar el panel
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>«Nueva propiedad» crea una ficha; completa título, comuna, superficies y precio en UF.</li>
          <li>La foto se sube desde el mismo formulario (máx. 10 MB, formato JPG o PNG).</li>
          <li>El botón del ojo publica u oculta la propiedad en el sitio público.</li>
          <li>La estrella marca la propiedad como destacada en la portada.</li>
          <li>Las características se escriben separadas por comas, por ejemplo: Piscina, Quincho.</li>
          <li>Solo tu cuenta de administrador puede crear, editar o eliminar propiedades.</li>
        </ul>
      </div>

      <div className="mt-8 space-y-4">
        {filas.map((f) => (
          <div
            key={f.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <img
              src={previews[f.id] ?? defaultImage}
              alt={f.titulo}
              className="h-20 w-28 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-[200px] flex-1">
              <p className="font-display font-semibold text-foreground">{f.titulo}</p>
              <p className="text-sm text-muted-foreground">
                {f.tipo} · {f.comuna} · {formatUF(Number(f.precio_uf))}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {f.publicada ? "Publicada" : "Oculta"}
                {f.destacada ? " · Destacada" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => alternarPublicada(f)}
                title={f.publicada ? "Ocultar del sitio" : "Publicar"}
                className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:bg-secondary"
              >
                {f.publicada ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => alternarDestacada(f)}
                title="Destacar en la portada"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:bg-secondary"
              >
                <Star className={`h-4 w-4 ${f.destacada ? "fill-accent text-accent" : ""}`} />
              </button>
              <button
                onClick={() => setEditando({ ...f })}
                title="Editar"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:bg-secondary"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => eliminar(f)}
                title="Eliminar"
                className="grid h-10 w-10 place-items-center rounded-lg border border-border text-destructive hover:bg-secondary"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {filas.length === 0 && (
          <p className="text-muted-foreground">Aún no hay propiedades. Crea la primera.</p>
        )}
      </div>

      <p className="mt-8 text-sm">
        <Link to="/propiedades" className="text-primary hover:underline">
          Ver el catálogo público →
        </Link>
      </p>

      {editando && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/50 p-4">
          <div className="mx-auto my-8 max-w-2xl rounded-3xl bg-card p-6 shadow-xl">
            <h2 className="font-display text-xl font-bold text-foreground">
              {editando.id ? "Editar propiedad" : "Nueva propiedad"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm">
                Título
                <input
                  className={`mt-1 ${input}`}
                  value={editando.titulo}
                  onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                />
              </label>
              <label className="text-sm">
                Comuna
                <input
                  className={`mt-1 ${input}`}
                  value={editando.comuna}
                  onChange={(e) => setEditando({ ...editando, comuna: e.target.value })}
                />
              </label>
              <label className="text-sm">
                Región
                <input
                  className={`mt-1 ${input}`}
                  value={editando.region}
                  onChange={(e) => setEditando({ ...editando, region: e.target.value })}
                />
              </label>
              <label className="text-sm">
                Tipo
                <select
                  className={`mt-1 ${input}`}
                  value={editando.tipo}
                  onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}
                >
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Precio (UF)
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.precio_uf}
                  onChange={(e) => setEditando({ ...editando, precio_uf: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                Terreno (m²)
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.terreno_m2}
                  onChange={(e) => setEditando({ ...editando, terreno_m2: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                Construidos (m²)
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.construidos_m2}
                  onChange={(e) =>
                    setEditando({ ...editando, construidos_m2: Number(e.target.value) })
                  }
                />
              </label>
              <label className="text-sm">
                Habitaciones
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.habitaciones}
                  onChange={(e) =>
                    setEditando({ ...editando, habitaciones: Number(e.target.value) })
                  }
                />
              </label>
              <label className="text-sm">
                Baños
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.banos}
                  onChange={(e) => setEditando({ ...editando, banos: Number(e.target.value) })}
                />
              </label>
              <label className="text-sm">
                Estacionamientos
                <input
                  type="number"
                  className={`mt-1 ${input}`}
                  value={editando.estacionamientos}
                  onChange={(e) =>
                    setEditando({ ...editando, estacionamientos: Number(e.target.value) })
                  }
                />
              </label>
              <label className="sm:col-span-2 text-sm">
                Descripción
                <textarea
                  rows={4}
                  className={`mt-1 ${input}`}
                  value={editando.descripcion}
                  onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-sm">
                Características (separadas por comas)
                <input
                  className={`mt-1 ${input}`}
                  value={editando.caracteristicas.join(", ")}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      caracteristicas: e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              <label className="sm:col-span-2 text-sm">
                Foto principal
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const ruta = await subirFoto(file);
                      if (ruta) {
                        setEditando({ ...editando, imagen_url: ruta });
                        toast.success("Foto cargada");
                      }
                    }}
                    className="text-sm text-muted-foreground"
                  />
                  {editando.imagen_url && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Upload className="h-3 w-3" /> Foto lista
                    </span>
                  )}
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editando.publicada}
                  onChange={(e) => setEditando({ ...editando, publicada: e.target.checked })}
                />
                Publicada en el sitio
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editando.destacada}
                  onChange={(e) => setEditando({ ...editando, destacada: e.target.checked })}
                />
                Destacada en la portada
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditando(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
