import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getProducts } from "@/lib/products.functions";
import { saveProduct, deleteProduct } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";
import { productSchema } from "@/lib/schemas";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
  head: () => ({
    meta: [
      { title: "Gerenciar Produtos — Tibia Shop" },
      { name: "description", content: "Cadastre e gerencie pacotes de Tibia Coins na Tibia Shop." },
    ],
  }),
});

const productsQueryOptions = () => ({
  queryKey: ["adminProducts"],
  queryFn: () => getProducts({ data: undefined }),
});

const emptyProduct = {
  id: "",
  name: "",
  slug: "",
  coin_amount: 0,
  price: 0,
  description: "",
  image_url: "",
  is_popular: false,
  active: true,
  sort_order: 0,
};

function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const saveProductFn = useServerFn(saveProduct);
  const deleteProductFn = useServerFn(deleteProduct);

  const [editing, setEditing] = useState<typeof emptyProduct | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleEdit = (product: (typeof products)[number]) => {
    setEditing({
      id: product.id,
      name: product.name,
      slug: product.slug,
      coin_amount: product.coin_amount,
      price: product.price,
      description: product.description ?? "",
      image_url: product.image_url ?? "",
      is_popular: product.is_popular,
      active: product.active,
      sort_order: product.sort_order,
    });
  };

  const handleNew = () => {
    setEditing({ ...emptyProduct });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!editing) return;
    try {
      productSchema.parse(editing);
      await saveProductFn({ data: editing });
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
      setMessage("Produto salvo com sucesso.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar produto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
    await deleteProductFn({ data: { id } });
    queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price / 100);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">Produtos</h1>
        <Button onClick={handleNew} className="bg-gold text-void hover:bg-gold/90">
          <Plus className="mr-2 size-4" />
          Novo Pacote
        </Button>
      </div>

      {message && (
        <p className={`mb-6 text-sm ${message.includes("sucesso") ? "text-gold" : "text-destructive"}`}>
          {message}
        </p>
      )}

      {editing && (
        <div className="mb-8 border border-gold/10 bg-chamber p-1">
          <form onSubmit={handleSave} className="bg-void p-6">
            <h2 className="mb-4 font-display text-lg text-gold">
              {editing.id ? "Editar Pacote" : "Novo Pacote"}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Nome</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Slug</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Quantidade de Coins</Label>
                <Input
                  type="number"
                  value={editing.coin_amount}
                  onChange={(e) => setEditing({ ...editing, coin_amount: parseInt(e.target.value) || 0 })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Preço (centavos)</Label>
                <Input
                  type="number"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase text-muted-foreground">Descrição</Label>
                <Input
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase text-muted-foreground">URL da Imagem</Label>
                <Input
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div>
                <Label className="text-xs uppercase text-muted-foreground">Ordem</Label>
                <Input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="border-gold/10 bg-chamber text-foreground focus-visible:ring-gold"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editing.is_popular}
                    onCheckedChange={(checked) => setEditing({ ...editing, is_popular: checked })}
                  />
                  <Label className="text-xs uppercase text-muted-foreground">Mais Popular</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editing.active}
                    onCheckedChange={(checked) => setEditing({ ...editing, active: checked })}
                  />
                  <Label className="text-xs uppercase text-muted-foreground">Ativo</Label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit" className="bg-gold text-void hover:bg-gold/90">
                <Save className="mr-2 size-4" />
                Salvar
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(null)} className="border-gold/30 text-gold hover:bg-gold/10">
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gold/10 bg-chamber">
        <table className="w-full text-sm">
          <thead className="bg-void text-left">
            <tr>
              <th className="p-4 font-display text-xs uppercase tracking-widest text-gold">Pacote</th>
              <th className="p-4 font-display text-xs uppercase tracking-widest text-gold">Coins</th>
              <th className="p-4 font-display text-xs uppercase tracking-widest text-gold">Preço</th>
              <th className="p-4 font-display text-xs uppercase tracking-widest text-gold">Status</th>
              <th className="p-4 font-display text-xs uppercase tracking-widest text-gold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gold/10">
                <td className="p-4">
                  <p className="font-medium text-foreground">{product.name}</p>
                  {product.is_popular && <span className="text-[10px] font-bold uppercase text-gold">Popular</span>}
                </td>
                <td className="p-4 text-muted-foreground">{product.coin_amount}</td>
                <td className="p-4 text-muted-foreground">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase ${product.active ? "text-gold" : "text-muted-foreground"}`}>
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                      className="text-gold hover:bg-gold/10"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
