import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  coin_amount: z.number().int().positive(),
  price: z.number().int().positive(),
  description: z.string().max(500).optional(),
  image_url: z.string().max(500).optional(),
  is_popular: z.boolean().default(false),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: !!isAdmin };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) throw new Error("Acesso negado");

    const { count: totalOrders } = await context.supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: pendingOrders } = await context.supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: totalCustomers } = await context.supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { data: revenue } = await context.supabase
      .from("orders")
      .select("total")
      .eq("status", "paid");

    const totalRevenue = revenue?.reduce((sum, order) => sum + (order.total ?? 0), 0) ?? 0;

    return {
      totalOrders: totalOrders ?? 0,
      pendingOrders: pendingOrders ?? 0,
      totalCustomers: totalCustomers ?? 0,
      totalRevenue,
    };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) throw new Error("Acesso negado");

    const productData = {
      name: data.name,
      slug: data.slug,
      coin_amount: data.coin_amount,
      price: data.price,
      description: data.description,
      image_url: data.image_url,
      is_popular: data.is_popular,
      active: data.active,
      sort_order: data.sort_order,
    };

    if (data.id) {
      const { error } = await context.supabase
        .from("products")
        .update(productData)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("products").insert(productData);
      if (error) throw new Error(error.message);
    }

    return { success: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) throw new Error("Acesso negado");

    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { success: true };
  });
