import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { CheckoutForm } from "@/components/checkout-form";
import { getProfile } from "@/lib/profiles.functions";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({
    meta: [
      { title: "Checkout — Tibia Shop" },
      { name: "description", content: "Finalize sua compra de Tibia Coins na Tibia Shop." },
    ],
  }),
});

const profileQueryOptions = () => ({
  queryKey: ["profile"],
  queryFn: () => getProfile({ data: undefined }),
  staleTime: 5 * 60 * 1000,
});

function Checkout() {
  const { user } = useAuth();
  const { data: profile } = useSuspenseQuery(
    user ? profileQueryOptions() : { ...profileQueryOptions(), queryFn: () => null }
  );

  return (
    <div className="relative py-16">
      <div className="hero-glow pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-30" />
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Finalizar Pedido</h1>
          <p className="mt-2 text-sm text-muted-foreground">Revise seu inventário e preencha os dados para entrega.</p>
        </div>
        <CheckoutForm
          user={user}
          defaultCharacterName={profile?.character_name ?? ""}
          defaultServer={profile?.server ?? ""}
        />
      </div>
    </div>
  );
}
