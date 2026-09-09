import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";

export type Property = {
  /** Identificador único usado en la URL, ej: /propiedades/casa-lo-barnechea */
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  tipo: string;
  descripcion: string;
  terrenoM2: number;
  construidosM2: number;
  habitaciones: number;
  banos: number;
  estacionamientos?: number;
  precioUF: number;
  imagen: string;
  destacada?: boolean;
  publicada?: boolean;
  caracteristicas?: string[];
};

export const TIPOS = ["Casa", "Departamento", "Terreno", "Oficina", "Parcela", "Local comercial"];

/** Imágenes de respaldo para las propiedades de ejemplo que aún no tienen foto propia. */
export const fallbackImages: Record<string, string> = {
  "casa-mediterranea-lo-barnechea": prop1,
  "departamento-vista-providencia": prop2,
  "casa-costera-zapallar": prop3,
};

export const defaultImage = prop1;

export const formatUF = (uf: number) =>
  `UF ${new Intl.NumberFormat("es-CL").format(Math.round(uf))}`;

export const SITE = {
  nombre: "Dan Propiedades",
  telefono: "+56 9 9840 2814",
  whatsapp: "56998402814",
  email: "info.danpropiedades@gmail.com",
  direccion: "Santiago, Chile",
};

export const whatsappLink = (mensaje: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;
