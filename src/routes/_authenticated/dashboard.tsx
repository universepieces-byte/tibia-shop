import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { User, Server, Save, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderList } from "@/components/order-list";
import { getProfile, updateProfile } from "@/lib/profiles.functions";
import { getMyOrders } from "@/lib/orders.functions";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { profileSchema } from "@/lib/schemas";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Área do Cliente — Tibia Shop" },
      {
        name: "description",
        content: "Acompanhe seus pedidos de Tibia Coins e gerencie seus dados na Tibia Shop.",
      },
    ],
  }),
});

const profileQueryOptions = () => ({
  queryKey: ["profile"],
  queryFn: () => getProfile({ data: undefined }),
});

const ordersQueryOptions = () => ({
  queryKey: ["myOrders"],
  queryFn: () => getMyOrders({ data: undefined }),
});

function Dashboard() {
  const { data: profile } = useSuspenseQuery(profileQueryOptions());
  const { data: orders } = useSuspenseQuery(ordersQueryOptions());
  const updateProfileFn = useServerFn(updateProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    character_name: profile?.character_name ?? "",
    server: profile?.server ?? "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      profileSchema.parse(form);
      await updateProfileFn({ data: form });
      setMessage("Dados atualizados com sucesso.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="font-display mb-8 text-3xl font-bold text-white">Área do Cliente</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="border border-gold/10 bg-chamber p-1">
              <div className="bg-void p-6">
                <h2 className="mb-6 font-display text-lg text-gold">Meus Dados</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      <User className="mr-1 inline size-3" />
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-2 border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="character_name"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      <Package className="mr-1 inline size-3" />
                      Personagem padrão
                    </Label>
                    <Input
                      id="character_name"
                      value={form.character_name}
                      onChange={(e) => setForm({ ...form, character_name: e.target.value })}
                      className="mt-2 border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="server"
                      className="text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      <Server className="mr-1 inline size-3" />
                      Servidor padrão
                    </Label>
                    <Input
                      id="server"
                      value={form.server}
                      onChange={(e) => setForm({ ...form, server: e.target.value })}
                      className="mt-2 border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                    />
                  </div>
                  {message && (
                    <p
                      className={`text-sm ${message.includes("sucesso") ? "text-gold" : "text-destructive"}`}
                    >
                      {message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gold text-void hover:bg-gold/90"
                  >
                    <Save className="mr-2 size-4" />
                    {saving ? "Salvando..." : "Salvar dados"}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-gold/10 bg-chamber p-1">
              <div className="bg-void p-6">
                <h2 className="mb-6 font-display text-lg text-gold">Meus Pedidos</h2>
                <OrderList orders={orders ?? []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
