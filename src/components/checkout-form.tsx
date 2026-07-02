import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { User, Server, MessageSquare, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart, cartTotal } from "@/hooks/use-cart";
import { createOrder } from "@/lib/orders.functions";
import { checkoutSchema } from "@/lib/schemas";

interface CheckoutFormProps {
  user: { id: string; email?: string } | null;
  defaultCharacterName?: string;
  defaultServer?: string;
}

export function CheckoutForm({ user, defaultCharacterName = "", defaultServer = "" }: CheckoutFormProps) {
  const navigate = useNavigate();
  const items = useCart((state) => state.items);
  const total = cartTotal(items);
  const clearCart = useCart((state) => state.clearCart);
  const createOrderFn = useServerFn(createOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    character_name: defaultCharacterName,
    server: defaultServer,
    payment_method: "pix" as "pix" | "manual",
    notes: "",
  });

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Seu carrinho está vazio");
      return;
    }

    if (!user) {
      navigate({ to: "/auth" });
      return;
    }

    setLoading(true);
    try {
      checkoutSchema.parse(form);
      const result = await createOrderFn({
        data: {
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            coinAmount: item.coinAmount,
            price: item.price,
            quantity: item.quantity,
          })),
          total,
          characterName: form.character_name,
          server: form.server,
          paymentMethod: form.payment_method,
          notes: form.notes,
        },
      });
      clearCart();
      navigate({ to: "/dashboard", search: { success: result.orderId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gold/10 bg-chamber p-1">
      <div className="bg-void p-8">
        <h2 className="font-display mb-6 text-2xl text-white">Finalizar Pedido</h2>

        <div className="mb-6 border-b border-gold/10 pb-6">
          <h3 className="mb-4 font-display text-sm tracking-widest text-gold">RESUMO DO INVENTÁRIO</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name} ({item.coinAmount * item.quantity} coins)
                </span>
                <span className="text-foreground">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format((item.price * item.quantity) / 100)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gold/10 pt-4">
            <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="font-display text-2xl text-gold">{formattedTotal}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="character_name" className="text-xs uppercase tracking-widest text-muted-foreground">
                <User className="mr-1 inline size-3" />
                Personagem
              </Label>
              <Input
                id="character_name"
                value={form.character_name}
                onChange={(e) => setForm({ ...form, character_name: e.target.value })}
                className="mt-2 border-gold/10 bg-chamber text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                placeholder="Ex: Sir Kaelis"
                required
              />
            </div>
            <div>
              <Label htmlFor="server" className="text-xs uppercase tracking-widest text-muted-foreground">
                <Server className="mr-1 inline size-3" />
                Servidor
              </Label>
              <Input
                id="server"
                value={form.server}
                onChange={(e) => setForm({ ...form, server: e.target.value })}
                className="mt-2 border-gold/10 bg-chamber text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                placeholder="Ex: Celebra"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">
              <CreditCard className="mr-1 inline size-3" />
              Forma de pagamento
            </Label>
            <RadioGroup
              value={form.payment_method}
              onValueChange={(value) => setForm({ ...form, payment_method: value as "pix" | "manual" })}
              className="mt-4 grid grid-cols-2 gap-4"
            >
              <div className="border border-gold/10 bg-chamber p-4 has-[[data-state=checked]]:border-gold/40">
                <RadioGroupItem value="pix" id="pix" className="border-gold/30 text-gold" />
                <Label htmlFor="pix" className="ml-2 text-sm text-foreground">PIX</Label>
                <p className="mt-1 text-xs text-muted-foreground">Você receberá os dados para pagamento.</p>
              </div>
              <div className="border border-gold/10 bg-chamber p-4 has-[[data-state=checked]]:border-gold/40">
                <RadioGroupItem value="manual" id="manual" className="border-gold/30 text-gold" />
                <Label htmlFor="manual" className="ml-2 text-sm text-foreground">Manual</Label>
                <p className="mt-1 text-xs text-muted-foreground">Negociar diretamente com o vendedor.</p>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs uppercase tracking-widest text-muted-foreground">
              <MessageSquare className="mr-1 inline size-3" />
              Observações
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-2 border-gold/10 bg-chamber text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
              placeholder="Alguma informação extra para a entrega?"
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading || items.length === 0} className="w-full bg-gold text-void hover:bg-gold/90">
            {loading ? "Finalizando..." : "Confirmar Pedido"}
          </Button>

          {!user && (
            <p className="text-center text-sm text-muted-foreground">
              Você precisa{" "}
              <a href="/auth" className="text-gold hover:underline">
                entrar ou criar uma conta
              </a>{" "}
              para finalizar o pedido.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
