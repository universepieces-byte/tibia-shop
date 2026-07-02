import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { OrderList } from "@/components/order-list";
import { getAllOrders } from "@/lib/orders.functions";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
  head: () => ({
    meta: [
      { title: "Gerenciar Pedidos — Tibia Shop" },
      { name: "description", content: "Gerencie todos os pedidos de Tibia Coins na Tibia Shop." },
    ],
  }),
});

const ordersQueryOptions = () => ({
  queryKey: ["adminOrders"],
  queryFn: () => getAllOrders({ data: undefined }),
});

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders } = useSuspenseQuery(ordersQueryOptions());

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold text-white">Pedidos</h1>
      <OrderList orders={orders ?? []} isAdmin onUpdate={handleUpdate} />
    </div>
  );
}
