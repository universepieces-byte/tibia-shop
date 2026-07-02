import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  character_name: z.string().min(2).max(50),
  server: z.string().min(2).max(50),
});

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => profileUpdateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        character_name: data.character_name,
        server: data.server,
      })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { success: true };
  });
