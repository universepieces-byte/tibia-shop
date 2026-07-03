import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({
    meta: [
      { title: "Entrar — Tibia Shop" },
      {
        name: "description",
        content: "Entre ou crie sua conta na Tibia Shop para comprar Tibia Coins com segurança.",
      },
    ],
  }),
});

function Auth() {
  return (
    <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-40" />
      <div className="relative z-10 mx-auto w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white">Acesso à Guilda</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre ou crie sua conta para gerenciar seus pedidos.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
