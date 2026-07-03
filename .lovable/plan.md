Plano de construção do Tibia Shop

Objetivo
Criar um e-commerce de Tibia Coins em português do Brasil, com identidade visual dark fantasy (preto, pedra e dourado), vitrine de pacotes fixos, checkout, área do cliente, login/cadastro e painel administrativo.

Escopo de funcionalidades

- Vitrine pública de pacotes de coins na home
- Carrinho e checkout com dados do personagem/servidor
- Login e cadastro com email/senha e Google
- Área do cliente com histórico de pedidos e dados da conta
- Painel administrativo para gerenciar pedidos, produtos e status de entrega
- Backend no Lovable Cloud (banco de dados + autenticação)
- Pagamentos: construir o site primeiro, depois reavaliar Stripe/Paddle

Direção visual selecionada

- "Arcane gothic dark": paleta escura com dourado enferrujado
- Fontes: Cinzel (títulos) + Inter (corpo)
- Tokens: void #0a0a0c, chamber #14141a, gold #c5a059, gold-muted #846d3e
- Cards de pacotes com bordas sutis, hover dourado e badge "Mais Popular"

Estrutura de rotas

```text
src/routes/
  __root.tsx              layout raiz com nav e footer
  index.tsx               home com hero e vitrine
  auth.tsx                login/cadastro
  checkout.tsx            checkout do carrinho
  _authenticated/
    route.tsx             guarda de autenticação (auto-gerido)
    dashboard.tsx         área do cliente
  admin/
    route.tsx             layout admin com sidebar
    index.tsx             dashboard resumo
    orders.tsx            lista de pedidos
    products.tsx          gerenciamento de produtos
```

Banco de dados
Tabelas no Lovable Cloud (migrations com GRANTs):

- `profiles`: id, user_id, name, character_name, server, role, created_at
- `products`: id, name, slug, coin_amount, price, description, image_url, is_popular, active, sort_order
- `orders`: id, user_id, status, total, character_name, server, payment_method, created_at
- `order_items`: id, order_id, product_id, quantity, price_at_purchase
- `user_roles`: id, user_id, role (admin|customer)

Autenticação

- Email/senha + Google OAuth (padrão Lovable Cloud)
- Trigger para criar perfil automaticamente no signup
- RLS para proteger dados por usuário
- Função `has_role` para verificar admin

Componentes principais

- Header com navegação, carrinho e área do cliente
- Hero com CTA e contador de entregas
- Grid de pacotes com preço e botão de compra
- Carrinho lateral (sheet)
- Formulários de checkout e autenticação
- Tabelas de pedidos no admin e dashboard

Imagens
Gerar 4 imagens para os pacotes:

- 250 coins: pilha pequena de moedas douradas com runas
- 750 coins: baú de madeira transbordando moedas
- 1500 coins: cofre grande em masmorra
- 4500 coins: artefato lendário cercado por moedas

Fluxo de pagamentos

1. Construir todo o site e o fluxo de pedidos primeiro
2. Reexecutar `recommend_payment_provider` para avaliar Paddle/Stripe
3. Integrar o provedor recomendado e criar produtos
4. Implementar webhook para atualizar status do pedido

Validações e segurança

- Validação de formulários com Zod
- Server functions para operações sensíveis
- RLS em todas as tabelas de dados
- Nunca expor service role key no client

Próximos passos

1. Aplicar design system e criar estrutura de rotas
2. Criar migrations do banco e seed de produtos
3. Implementar home, auth, checkout, dashboard e admin
4. Gerar imagens e ajustar metadados/SEO
5. Reavaliar pagamentos e integrar provedor
6. Testar fluxo completo e publicar
