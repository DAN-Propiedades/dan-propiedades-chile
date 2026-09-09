import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administrador | Dan Propiedades" },
      { name: "description", content: "Acceso privado para administrar las propiedades del sitio." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acceso administrador | Dan Propiedades" },
      { property: "og:description", content: "Panel privado de Dan Propiedades." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido de vuelta");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          toast.success("Cuenta creada");
          navigate({ to: "/admin" });
        } else {
          toast.success("Cuenta creada. Revisa tu correo para confirmarla.");
          setModo("login");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No pudimos completar la acción");
    } finally {
      setCargando(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-display text-3xl font-bold text-foreground">Acceso administrador</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ingresa para administrar las propiedades del sitio. La primera cuenta creada queda como
        administradora.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Correo
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 ${inputClass}`}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 ${inputClass}`}
            autoComplete={modo === "login" ? "current-password" : "new-password"}
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {cargando ? "Procesando…" : modo === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <button
        onClick={() => setModo(modo === "login" ? "registro" : "login")}
        className="mt-5 text-sm font-medium text-primary hover:underline"
      >
        {modo === "login" ? "Crear la cuenta de administrador" : "Ya tengo cuenta, quiero entrar"}
      </button>

      <p className="mt-8 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-primary">
          ← Volver al sitio
        </Link>
      </p>
    </div>
  );
}
