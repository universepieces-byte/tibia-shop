import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User, Chrome } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { loginSchema, signupSchema } from "@/lib/schemas";

export function AuthForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", name: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      loginSchema.parse(loginData);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      signupSchema.parse(signupData);
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: { name: signupData.name },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="border border-gold/10 bg-chamber p-1">
        <div className="bg-void p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 bg-chamber">
              <TabsTrigger
                value="login"
                className="font-display text-xs tracking-widest data-[state=active]:bg-gold data-[state=active]:text-void"
              >
                ENTRAR
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="font-display text-xs tracking-widest data-[state=active]:bg-gold data-[state=active]:text-void"
              >
                CRIAR CONTA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label
                    htmlFor="login-email"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold/50" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="border-gold/10 bg-chamber pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="login-password"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Senha
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold/50" />
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="border-gold/10 bg-chamber pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                      placeholder="••••••"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-void hover:bg-gold/90"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label
                    htmlFor="signup-name"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Nome
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold/50" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="border-gold/10 bg-chamber pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="signup-email"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Email
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold/50" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="border-gold/10 bg-chamber pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="signup-password"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Senha
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold/50" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="border-gold/10 bg-chamber pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-gold"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-void hover:bg-gold/90"
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gold/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-void px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            <Button
              onClick={handleGoogle}
              variant="outline"
              className="mt-4 w-full border-gold/30 text-foreground hover:bg-gold/10"
            >
              <Chrome className="mr-2 size-4" />
              Entrar com Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
