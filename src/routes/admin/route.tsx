import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin-sidebar";
import { checkAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const checkAdminFn = useServerFn(checkAdmin);

  useEffect(() => {
    checkAdminFn({ data: undefined })
      .then((result) => {
        if (!result.isAdmin) {
          navigate({ to: "/dashboard" });
        }
      })
      .catch(() => navigate({ to: "/dashboard" }));
  }, [checkAdminFn, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-void p-8">
        <Outlet />
      </main>
    </div>
  );
}
