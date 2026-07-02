import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Shield, Clock, Lock, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tibia Shop — Tibia Coins com entrega rápida" },
      { name: "description", content: "Compre Tibia Coins com segurança, entrega rápida e pagamento facilitado. Pacotes de 250 a 4500 coins para abastecer sua jornada em Tibia." },
    ],
  }),
});

const productsQueryOptions = () => ({
  queryKey: ["products"],
  queryFn: () => getProducts({ data: undefined }),
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gold/10 py-24 md:py-36">
        <div className="hero-glow pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 opacity-60" />
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 border border-gold/20 bg-chamber px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="size-3" />
            Entrega rápida e segura
          </div>
          <h1 className="font-display mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Abasteça sua jornada em <span className="text-gold">Tibia</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Adquira Tibia Coins com segurança, pagamento facilitado e entrega rápida. Escolha seu pacote e receba diretamente no jogo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#pacotes">
              <Button className="bg-gold px-8 py-6 text-sm font-bold uppercase tracking-widest text-void hover:bg-gold/90">
                Ver Pacotes
              </Button>
            </a>
            <a href="/checkout">
              <Button variant="outline" className="border-gold/30 px-8 py-6 text-sm font-bold uppercase tracking-widest text-gold hover:bg-gold/10">
                Checkout Rápido
              </Button>
            </a>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="border border-gold/10 bg-chamber p-6 text-center">
              <Shield className="mx-auto mb-4 size-8 text-gold" />
              <h3 className="font-display text-sm uppercase tracking-widest text-foreground">Compra Segura</h3>
              <p className="mt-2 text-sm text-muted-foreground">Transações protegidas e dados criptografados.</p>
            </div>
            <div className="border border-gold/10 bg-chamber p-6 text-center">
              <Clock className="mx-auto mb-4 size-8 text-gold" />
              <h3 className="font-display text-sm uppercase tracking-widest text-foreground">Entrega Rápida</h3>
              <p className="mt-2 text-sm text-muted-foreground">Receba suas coins em até 5 minutos após confirmação.</p>
            </div>
            <div className="border border-gold/10 bg-chamber p-6 text-center">
              <Lock className="mx-auto mb-4 size-8 text-gold" />
              <h3 className="font-display text-sm uppercase tracking-widest text-foreground">Suporte 24h</h3>
              <p className="mt-2 text-sm text-muted-foreground">Atendimento dedicado para tirar qualquer dúvida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="pacotes" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Escolha seu <span className="text-gold">pacote</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pacotes de Tibia Coins para todos os tipos de jogadores — de aventureiros a guildas inteiras.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gold/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Pronto para fortalecer seu personagem?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Crie uma conta gratuita e acompanhe todos os seus pedidos em um só lugar.
          </p>
          <a href="/auth">
            <Button className="mt-8 bg-gold px-8 py-6 text-sm font-bold uppercase tracking-widest text-void hover:bg-gold/90">
              Criar Conta
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
