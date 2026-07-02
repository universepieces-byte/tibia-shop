import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface CartSheetProps {
  onClose: () => void;
}

export function CartSheet({ onClose }: CartSheetProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total / 100);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <h2 className="font-display text-xl text-foreground">Seu Inventário</h2>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <ShoppingBag className="mb-4 size-12 opacity-20" />
            <p className="text-sm">Seu baú está vazio.</p>
            <Button onClick={onClose} variant="outline" className="mt-4 border-gold/30 text-gold hover:bg-gold/10">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border-b border-gold/5 pb-4"
              >
                <div className="flex h-12 w-12 items-center justify-center bg-gold/5 text-[10px] font-bold text-gold/60">
                  {item.coinAmount}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format((item.price * item.quantity) / 100)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-gold/30 text-gold"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-gold/30 text-gold"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gold/10 pt-4">
          <div className="mb-4 flex justify-between">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-gold">{formattedTotal}</span>
          </div>
          <Link to="/checkout" onClick={onClose}>
            <Button className="w-full bg-gold text-void hover:bg-gold/90">
              Finalizar Compra
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
