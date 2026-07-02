import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateOrderStatus } from "@/lib/orders.functions";

interface OrderListProps {
  orders: Array<{
    id: string;
    status: string;
    total: number;
    character_name: string;
    server: string;
    payment_method: string;
    created_at: string;
    notes?: string | null;
    order_items?: Array<{
      id: string;
      quantity: number;
      price_at_purchase: number;
      coin_amount: number;
      product?: { name: string; coin_amount: number } | null;
    }>;
    profile?: { name: string | null; email: string | null } | null;
  }>;
  isAdmin?: boolean;
  onUpdate?: () => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  processing: "Em processamento",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  paid: "default",
  processing: "secondary",
  delivered: "default",
  cancelled: "destructive",
};

export function OrderList({ orders, isAdmin, onUpdate }: OrderListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const updateStatus = useServerFn(updateOrderStatus);

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateStatus({ data: { orderId, status } });
    onUpdate?.();
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gold/10 bg-chamber py-16 text-muted-foreground">
          <Package className="mb-4 size-12 opacity-20" />
          <p className="text-sm">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-lg border border-gold/10 bg-chamber">
            <div
              className="flex cursor-pointer items-center justify-between p-4 hover:bg-gold/5"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                  <Badge variant={statusVariants[order.status] ?? "outline"}>{statusLabels[order.status]}</Badge>
                </div>
                <p className="text-sm text-foreground">
                  {order.order_items?.reduce((sum, item) => sum + item.coin_amount * item.quantity, 0) ?? 0} coins —{" "}
                  {formatPrice(order.total)}
                </p>
                {isAdmin && order.profile && (
                  <p className="text-xs text-muted-foreground">
                    {order.profile.name ?? "Sem nome"} — {order.profile.email}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                {expanded === order.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </div>

            {expanded === order.id && (
              <div className="border-t border-gold/10 bg-void p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-gold">Detalhes da entrega</h4>
                    <p className="text-sm text-foreground">
                      Personagem: <span className="text-gold">{order.character_name}</span>
                    </p>
                    <p className="text-sm text-foreground">
                      Servidor: <span className="text-gold">{order.server}</span>
                    </p>
                    <p className="text-sm text-foreground">
                      Pagamento: <span className="capitalize text-gold">{order.payment_method}</span>
                    </p>
                    {order.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">Obs: {order.notes}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-gold">Itens</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {order.order_items?.map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.product?.name ?? "Produto"} ({item.coin_amount * item.quantity} coins)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-gold/10 pt-4">
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <Button
                        key={status}
                        variant={order.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(order.id, status)}
                        className={order.status === status ? "bg-gold text-void" : "border-gold/30 text-gold hover:bg-gold/10"}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
