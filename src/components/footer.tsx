import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-void py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-lg font-bold tracking-widest text-gold">TIBIA SHOP</p>
            <p className="mt-2 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Tibia Shop. Não afiliado à CipSoft GmbH.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-gold">
              Termos
            </Link>
            <Link to="/" className="hover:text-gold">
              Privacidade
            </Link>
            <Link to="/" className="hover:text-gold">
              Suporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
