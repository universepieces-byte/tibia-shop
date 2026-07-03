import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Pedidos", url: "/admin/orders", icon: ShoppingBag },
  { title: "Produtos", url: "/admin/products", icon: Package },
  { title: "Clientes", url: "/admin", icon: Users },
];

export function AdminSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="min-h-screen w-64 border-r border-gold/10 bg-chamber p-6">
      <div className="mb-8">
        <p className="font-display text-lg font-bold tracking-widest text-gold">ADMIN</p>
        <p className="text-xs text-muted-foreground">Painel de controle</p>
      </div>

      <Link to="/">
        <Button
          variant="ghost"
          className="mb-6 w-full justify-start text-muted-foreground hover:text-gold"
        >
          <ChevronLeft className="mr-2 size-4" />
          Voltar ao site
        </Button>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <Link key={item.title} to={item.url}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive
                    ? "bg-gold text-void hover:bg-gold/90"
                    : "text-muted-foreground hover:bg-gold/10 hover:text-gold"
                }`}
              >
                <item.icon className="mr-2 size-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
