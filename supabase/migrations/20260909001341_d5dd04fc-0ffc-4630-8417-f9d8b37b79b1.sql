CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cada usuario ve sus roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_to_first_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_to_first_user();

CREATE TABLE public.propiedades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  comuna text NOT NULL,
  region text NOT NULL DEFAULT 'Región Metropolitana',
  tipo text NOT NULL DEFAULT 'Casa',
  descripcion text NOT NULL DEFAULT '',
  terreno_m2 integer NOT NULL DEFAULT 0,
  construidos_m2 integer NOT NULL DEFAULT 0,
  habitaciones integer NOT NULL DEFAULT 0,
  banos integer NOT NULL DEFAULT 0,
  estacionamientos integer NOT NULL DEFAULT 0,
  precio_uf numeric NOT NULL DEFAULT 0,
  imagen_url text,
  caracteristicas text[] NOT NULL DEFAULT '{}',
  destacada boolean NOT NULL DEFAULT false,
  publicada boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.propiedades TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.propiedades TO authenticated;
GRANT ALL ON public.propiedades TO service_role;
ALTER TABLE public.propiedades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Propiedades publicadas visibles para todos" ON public.propiedades
  FOR SELECT TO anon, authenticated USING (publicada = true);
CREATE POLICY "Administrador ve todas" ON public.propiedades
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrador crea" ON public.propiedades
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrador edita" ON public.propiedades
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrador elimina" ON public.propiedades
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER propiedades_updated_at BEFORE UPDATE ON public.propiedades
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.propiedades (slug, titulo, comuna, region, tipo, descripcion, terreno_m2, construidos_m2, habitaciones, banos, estacionamientos, precio_uf, caracteristicas, destacada, publicada) VALUES
('casa-mediterranea-lo-barnechea','Casa mediterránea con piscina','Lo Barnechea','Región Metropolitana','Casa','Casa familiar de dos pisos en condominio cerrado, con living comedor de doble altura, jardín consolidado y piscina. Excelente conectividad y entorno tranquilo.',620,245,4,3,2,18500,ARRAY['Piscina','Condominio cerrado','Jardín','Quincho'],true,true),
('departamento-vista-providencia','Departamento luminoso con vista a la cordillera','Providencia','Región Metropolitana','Departamento','Piso alto con ventanales de piso a cielo, orientación norponiente y vista despejada. A pasos del metro, parques y comercio.',0,96,3,2,1,7400,ARRAY['Piso alto','Cerca del metro','Bodega','Gimnasio'],true,true),
('casa-costera-zapallar','Casa costera con vista al mar','Zapallar','Región de Valparaíso','Casa','Refugio frente al océano con terraza de madera, atardeceres únicos y acceso directo a sendero costero. Ideal como segunda vivienda.',850,180,3,3,2,14200,ARRAY['Vista al mar','Terraza','Calefacción central'],true,true);