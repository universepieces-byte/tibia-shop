import { Link, useRouter } from "@tanstack/react-router";
import { ShoppingCart, User, Menu, LogOut, Shield } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart, cartItemCount } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { CartSheet } from "./cart-sheet";

export function Header() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = cartItemCount(useCart((state) => state.items));

  const handleLogout = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rotate-45 border border-gold/40 bg-gold/20">
            <span className="-rotate-45 font-display text-xl font-bold text-gold">TS</span>
          </div>
          <span className="font-display ml-2 text-xl tracking-widest text-gold">TIBIA SHOP</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-display text-sm tracking-widest text-muted-foreground transition-colors hover:text-gold"
          >
            COINS
          </Link>
          <Link
            to="/checkout"
            className="font-display text-sm tracking-widest text-muted-foreground transition-colors hover:text-gold"
          >
            CHECKOUT
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="font-display text-sm tracking-widest text-gold transition-colors hover:text-gold/80"
            >
              <Shield className="mr-1 inline size-4" />
              ADMIN
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Abrir carrinho"
                className="relative border-gold/30 bg-chamber text-gold hover:bg-gold/10"
              >
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-void">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full border-gold/10 bg-chamber sm:max-w-md">
              <CartSheet onClose={() => setCartOpen(false)} />
            </SheetContent>
          </Sheet>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/dashboard">
                <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <User className="mr-2 size-4" />
                  ÁREA DO CLIENTE
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-gold"
              >
                <LogOut className="size-5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button className="bg-gold text-void hover:bg-gold/90">
                <User className="mr-2 size-4" />
                ENTRAR
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-gold/30 bg-chamber text-gold">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-gold/10 bg-chamber">
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  to="/"
                  className="font-display text-sm tracking-widest text-foreground hover:text-gold"
                >
                  COINS
                </Link>
                <Link
                  to="/checkout"
                  className="font-display text-sm tracking-widest text-foreground hover:text-gold"
                >
                  CHECKOUT
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="font-display text-sm tracking-widest text-gold hover:text-gold/80"
                  >
                    ADMIN
                  </Link>
                )}
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="font-display text-sm tracking-widest text-foreground hover:text-gold"
                    >
                      ÁREA DO CLIENTE
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="font-display text-left text-sm tracking-widest text-muted-foreground hover:text-gold"
                    >
                      SAIR
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="font-display text-sm tracking-widest text-gold hover:text-gold/80"
                  >
                    ENTRAR
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
