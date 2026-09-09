import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";

export type Property = {
  /** Identificador único usado en la URL, ej: /propiedades/casa-lo-barnechea */
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  tipo: "Casa" | "Departamento" | "Terreno" | "Oficina";
  descripcion: string;
  terrenoM2: number;
  construidosM2: number;
  habitaciones: number;
  banos: number;
  estacionamientos?: number;
  precioUF: number;
  imagen: string;
  destacada?: boolean;
  caracteristicas?: string[];
};

/**
 * ── CÓMO AGREGAR O EDITAR UNA PROPIEDAD ───────────────────────────────
 * 1. Copia un bloque completo de abajo y pégalo dentro de la lista.
 * 2. Cambia los textos y números (el "id" debe ser único, sin espacios).
 * 3. Para la foto: sube la imagen a src/assets/ y agrégala arriba con
 *    import miFoto from "@/assets/mi-foto.jpg";  luego usa  imagen: miFoto
 *    (o pega la dirección de una imagen en internet entre comillas).
 * ──────────────────────────────────────────────────────────────────────
 */
export const properties: Property[] = [
  {
    id: "casa-mediterranea-lo-barnechea",
    titulo: "Casa mediterránea con piscina",
    comuna: "Lo Barnechea",
    region: "Región Metropolitana",
    tipo: "Casa",
    descripcion:
      "Casa familiar de dos pisos en condominio cerrado, con living comedor de doble altura, jardín consolidado y piscina. Excelente conectividad y entorno tranquilo.",
    terrenoM2: 620,
    construidosM2: 245,
    habitaciones: 4,
    banos: 3,
    estacionamientos: 2,
    precioUF: 18500,
    imagen: prop1,
    destacada: true,
    caracteristicas: ["Piscina", "Condominio cerrado", "Jardín", "Quincho"],
  },
  {
    id: "departamento-vista-providencia",
    titulo: "Departamento luminoso con vista a la cordillera",
    comuna: "Providencia",
    region: "Región Metropolitana",
    tipo: "Departamento",
    descripcion:
      "Piso alto con ventanales de piso a cielo, orientación norponiente y vista despejada. A pasos del metro, parques y comercio.",
    terrenoM2: 0,
    construidosM2: 96,
    habitaciones: 3,
    banos: 2,
    estacionamientos: 1,
    precioUF: 7400,
    imagen: prop2,
    destacada: true,
    caracteristicas: ["Piso alto", "Cerca del metro", "Bodega", "Gimnasio"],
  },
  {
    id: "casa-costera-zapallar",
    titulo: "Casa costera con vista al mar",
    comuna: "Zapallar",
    region: "Región de Valparaíso",
    tipo: "Casa",
    descripcion:
      "Refugio frente al océano con terraza de madera, atardeceres únicos y acceso directo a sendero costero. Ideal como segunda vivienda.",
    terrenoM2: 850,
    construidosM2: 180,
    habitaciones: 3,
    banos: 3,
    estacionamientos: 2,
    precioUF: 14200,
    imagen: prop3,
    destacada: true,
    caracteristicas: ["Vista al mar", "Terraza", "Calefacción central"],
  },
];

export const getProperty = (id: string) => properties.find((p) => p.id === id);

export const formatUF = (uf: number) =>
  `UF ${new Intl.NumberFormat("es-CL").format(uf)}`;

export const SITE = {
  nombre: "Dan Propiedades",
  telefono: "+56 9 9840 2814",
  whatsapp: "56998402814",
  email: "info.danpropiedades@gmail.com",
  direccion: "Santiago, Chile",
};

export const whatsappLink = (mensaje: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;
