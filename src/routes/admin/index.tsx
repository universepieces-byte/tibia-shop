import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingBag, Users, Clock, TrendingUp } from "lucide-react";

import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Tibia Shop" },
      { name: "description", content: "Painel administrativo da Tibia Shop." },
    ],
  }),
});

const statsQueryOptions = () => ({
  queryKey: ["adminStats"],
  queryFn: () => getAdminStats({ data: undefined }),
});

function AdminDashboard() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions());

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value / 100);

  const cards = [
    { label: "Total de Pedidos", value: stats?.totalOrders ?? 0, icon: ShoppingBag },
    { label: "Pendentes", value: stats?.pendingOrders ?? 0, icon: Clock },
    { label: "Clientes", value: stats?.totalCustomers ?? 0, icon: Users },
    {
      label: "Receita (pedidos pagos)",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-white">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-gold/10 bg-chamber p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {card.label}
              </span>
              <card.icon className="size-5 text-gold" />
            </div>
            <p className="font-display text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
