import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  character_name: z.string().min(2, "Nome do personagem deve ter pelo menos 2 caracteres").max(50),
  server: z.string().min(2, "Servidor deve ter pelo menos 2 caracteres").max(50),
});

export const checkoutSchema = z.object({
  character_name: z.string().min(2, "Nome do personagem é obrigatório").max(50),
  server: z.string().min(2, "Servidor é obrigatório").max(50),
  payment_method: z.enum(["pix", "manual"]),
  notes: z.string().max(500).optional(),
});

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "processing",
  "delivered",
  "cancelled",
]);

export const updateOrderSchema = z.object({
  orderId: z.string().uuid(),
  status: orderStatusSchema,
  notes: z.string().max(1000).optional(),
});

export const productSchema = z.object({
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
