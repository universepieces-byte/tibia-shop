import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { checkAdmin } from "@/lib/admin.functions";

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const checkAdminFn = useServerFn(checkAdmin);

  const { data: adminData } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return { isAdmin: false };
      return checkAdminFn({ data: undefined });
    },
    enabled: !!user,
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
        setLoading(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin: adminData?.isAdmin ?? false, loading };
}
