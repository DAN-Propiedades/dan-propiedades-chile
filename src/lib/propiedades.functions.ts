import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Property } from "@/data/properties";

type Row = Database["public"]["Tables"]["propiedades"]["Row"];

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const COLUMNS =
  "slug, titulo, comuna, region, tipo, descripcion, terreno_m2, construidos_m2, habitaciones, banos, estacionamientos, precio_uf, imagen_url, caracteristicas, destacada, publicada";

async function toProperty(
  client: ReturnType<typeof publicClient>,
  row: Pick<Row, keyof Row>,
): Promise<Property> {
  let imagen = row.imagen_url ?? "";
  if (imagen && !imagen.startsWith("http")) {
    const { data } = await client.storage.from("propiedades").createSignedUrl(imagen, 60 * 60 * 24);
    imagen = data?.signedUrl ?? "";
  }
  return {
    id: row.slug,
    titulo: row.titulo,
    comuna: row.comuna,
    region: row.region,
    tipo: row.tipo,
    descripcion: row.descripcion,
    terrenoM2: row.terreno_m2,
    construidosM2: row.construidos_m2,
    habitaciones: row.habitaciones,
    banos: row.banos,
    estacionamientos: row.estacionamientos,
    precioUF: Number(row.precio_uf),
    imagen,
    destacada: row.destacada,
    publicada: row.publicada,
    caracteristicas: row.caracteristicas ?? [],
  };
}

export const listPropiedades = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const { data, error } = await client
    .from("propiedades")
    .select(COLUMNS)
    .eq("publicada", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return Promise.all((data ?? []).map((row) => toProperty(client, row as Row)));
});

export const getPropiedad = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const client = publicClient();
    const { data: row, error } = await client
      .from("propiedades")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("publicada", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return toProperty(client, row as Row);
  });
