CREATE POLICY "Fotos de propiedades legibles" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'propiedades');
CREATE POLICY "Administrador sube fotos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'propiedades' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrador actualiza fotos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'propiedades' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrador borra fotos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'propiedades' AND public.has_role(auth.uid(), 'admin'));