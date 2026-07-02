import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  name: z.string(),
  coinAmount: z.number().int().positive(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  total: z.number().int().positive(),
  characterName: z.string().min(2).max(50),
  server: z.string().min(2).max(50),
  paymentMethod: z.enum(["pix", "manual"]),
  notes: z.string().max(500).optional(),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        total: data.total,
        character_name: data.characterName,
        server: data.server,
        payment_method: data.paymentMethod,
        notes: data.notes,
      })
      .select("id")
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Falha ao criar pedido");

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price,
      coin_amount: item.coinAmount,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    return { orderId: order.id };
  });

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, product:products(name, coin_amount))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAllOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) throw new Error("Acesso negado");

    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*, product:products(name, coin_amount))")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return data ?? [];
  });

const updateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "paid", "processing", "delivered", "cancelled"]),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    if (!isAdmin) throw new Error("Acesso negado");

    const updateData: { status: string; notes?: string; updated_at?: string } = {
      status: data.status,
    };
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { error } = await context.supabase
      .from("orders")
      .update(updateData)
      .eq("id", data.orderId);

    if (error) throw new Error(error.message);
    return { success: true };
  });
