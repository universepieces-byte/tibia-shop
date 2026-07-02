import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    coin_amount: number;
    price: number;
    description?: string | null;
    image_url?: string | null;
    is_popular: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price / 100);

  return (
    <div className="group relative border border-gold/5 bg-chamber p-1 transition-all duration-500 hover:border-gold/40">
      {product.is_popular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-void">
          Mais Popular
        </div>
      )}
      <div className="flex h-full flex-col items-center bg-void p-6 text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden bg-gold/5 outline outline-1 -outline-offset-1 outline-white/5">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-gold/40">
              {product.coin_amount} COINS
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[40px] text-sm text-muted-foreground">
          {product.description ?? `${product.coin_amount} Tibia Coins`}
        </p>
        <p className="mb-6 mt-4 text-3xl font-bold text-gold">{formattedPrice}</p>
        <ul className="mb-8 w-full space-y-2 text-left text-sm text-muted-foreground">
          <li className="flex items-center gap-2">• Entrega em até 5 minutos</li>
          <li className="flex items-center gap-2">• Sem taxas ocultas</li>
          <li className="flex items-center gap-2">• Transferível in-game</li>
        </ul>
        <Button
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              coinAmount: product.coin_amount,
              price: product.price,
              imageUrl: product.image_url ?? undefined,
            })
          }
          className="mt-auto w-full bg-gold/10 text-xs font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-void"
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </div>
  );
}
