# PRD — Marketplace SaaS de Materiais de Construção  
**Modelo operacional inspirado no iFood**  
**Documento único, fonte de verdade (Single Source of Truth)**  
**Uso: exportar, commitar no repositório e orientar implementação por AI agent**

---

## 1. Visão Geral do Produto

Construir um **Marketplace SaaS estilo iFood** para venda de **materiais de construção e itens correlatos** (ferramentas, EPIs, insumos), permitindo que:

- Clientes descubram produtos e comprem online
- Lojistas gerenciem vendas, pedidos, estoque e entregas
- A plataforma orquestre pagamento, estados do pedido e visibilidade
- Todo o fluxo seja **robusto, seguro e auditável**

O sistema deve ser **web-first**, com arquitetura preparada para mobile no futuro, sem complicar o MVP.

---

## 2. Objetivos do MVP

- Operar vendas reais com pagamento confirmado
- Reproduzir o **modelo operacional do iFood**
- Ter **máquina de estados explícita**
- Ter **sistema de entrega funcional (manual, mas real)**
- Garantir **segurança, tipagem e rastreabilidade**
- Ser simples de evoluir sem refatorações grandes

---

## 3. Não-Objetivos do MVP

- ❌ Frota própria da plataforma
- ❌ Integração com APIs de logística
- ❌ Cálculo dinâmico de frete
- ❌ Bundles (combos de produtos) — apenas preparação estrutural
- ❌ App mobile agora
- ❌ Sistema de avaliação
- ❌ Staging environment separado

---

## 4. Stack Técnica (Decisão Final)

### Frontend & Backend
- **Next.js (App Router)**
- Deploy direto na **Vercel**
- API via **Route Handlers**
- Server Actions apenas quando fizer sentido

### Banco de Dados
- **PostgreSQL**
- ORM: Prisma ou Drizzle

### Pagamentos
- **Stripe**
- Uso exclusivo de **Stripe Checkout URLs**
- Webhooks como fonte de verdade

### Autenticação
- Solução pronta (Better Auth, Lucia ou equivalente)
- **GitHub OAuth obrigatório**
- Sessão server-side validada

### Analytics
- **PostHog desde o dia zero**
- Eventos no frontend e backend

### Qualidade
- **TypeScript end-to-end**
- ESLint obrigatório
- Validação de input (ex: Zod)

---

## 5. Perfis de Usuário (RBAC)

- **Buyer (Cliente)**
- **Merchant (Lojista)**
- **Admin (futuro – sem UI no MVP)**

Permissões sempre validadas no backend.

---

## 6. Modelo Operacional (Igual ao iFood)

- Pedido **só existe** após pagamento confirmado
- Lojista **não é dono do pedido**, é executor
- Entrega é uma **responsabilidade atribuída**
- Tudo é controlado por **estados explícitos**
- Toda transição gera:
  - timestamp
  - audit log
  - evento de analytics

---

## 7. Máquina de Estados do Pedido

### Estados do Pedido (MVP)

- `CREATED`
- `PAYMENT_CONFIRMED`
- `WAITING_MERCHANT_ACCEPT`
- `PREPARING`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELED`

Nenhum estado pode ser pulado.

---

## 8. Sistema de Entrega (MVP)

### Modelo adotado
- **Entrega do lojista**
- **Retirada no local**

### Tipos
- `delivery`
- `pickup`

### Estados de Entrega
- `NOT_APPLICABLE`
- `PENDING`
- `IN_PREPARATION`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `DELIVERY_FAILED`

Sem mapas, sem GPS, sem integração externa.

---

## 9. Modelo de Dados (Resumo)

### Entidades principais
- users
- stores
- products
- orders
- order_items
- audit_logs
- stripe_events

### Campos críticos em orders
- status
- delivery_type
- delivery_address
- delivery_status
- accepted_at
- prepared_at
- delivered_at

---

## 10. Fluxo End-to-End

### Compra
1. Cliente seleciona produto
2. Backend cria Stripe Checkout Session
3. Cliente paga no Stripe
4. Webhook confirma pagamento
5. Pedido entra em `WAITING_MERCHANT_ACCEPT`

### Operação do Lojista
1. Lojista aceita pedido
2. Pedido entra em `PREPARING`
3. Lojista marca `OUT_FOR_DELIVERY`
4. Lojista marca `DELIVERED`

---

## 11. Milestones e Tasks (com checkboxes)

---

### Milestone 0 — Base Técnica e Qualidade
- [x] Criar monorepo
- [x] Configurar TypeScript strict
- [x] Configurar ESLint
- [x] Scripts: dev, build, lint, typecheck
- [x] Convenções de código documentadas

---

### Milestone 1 — Banco de Dados e Integridade
- [x] Configurar PostgreSQL
- [x] Configurar ORM
- [x] Criar migrations iniciais
- [x] Criar seeds básicos
- [x] Criar camada de acesso a dados tipada

---

### Milestone 2 — Autenticação e Autorização
- [ ] Implementar GitHub OAuth
- [ ] Persistir usuários no banco
- [ ] Definir roles
- [ ] Guards server-side
- [ ] Validação de acesso por store

---

### Milestone 3 — Catálogo e Navegação
- [ ] Página inicial
- [ ] Página de loja
- [ ] Página de produto
- [ ] Bloquear compra se loja fechada
- [ ] Evento PostHog: product_viewed

---

### Milestone 4 — Stripe e Pedidos
- [ ] Configurar Stripe SDK
- [ ] Criar Checkout Session
- [ ] Página success/cancel
- [ ] Webhook com validação e idempotência
- [ ] Criar pedido no pagamento confirmado
- [ ] Eventos PostHog de checkout

---

### Milestone 5 — Máquina de Estados
- [ ] Implementar enum de estados
- [ ] Regras de transição
- [ ] Bloquear transições inválidas
- [ ] Registrar timestamps por estado
- [ ] Criar audit logs

---

### Milestone 6 — Sistema de Entrega (MVP)
- [ ] Campos de entrega no pedido
- [ ] Seleção delivery/pickup
- [ ] Atualização manual de status pelo lojista
- [ ] Visualização do status pelo cliente
- [ ] Evento PostHog: delivery_status_updated

---

### Milestone 7 — Merchant Dashboard
- [ ] KPIs reais
- [ ] Toggle abrir/fechar loja
- [ ] Lista de pedidos
- [ ] Ação “Aceitar pedido”
- [ ] Mudança de status operacionais

---

### Milestone 8 — Inventário
- [ ] Listar produtos do lojista
- [ ] Atualizar preço
- [ ] Toggle disponibilidade
- [ ] Audit log before/after
- [ ] Eventos PostHog de inventário

---

### Milestone 9 — Analytics e Observabilidade
- [ ] PostHog frontend
- [ ] PostHog backend
- [ ] Propriedades padrão nos eventos
- [ ] Logging estruturado
- [ ] Documentação de eventos

---

### Milestone 10 — Segurança e Hardening
- [ ] Validação de input
- [ ] Rate limiting básico
- [ ] Proteção de acesso cruzado
- [ ] Soft delete onde aplicável
- [ ] Checklist de produção

---

## 12. Critério de Aceite do MVP

O MVP está concluído se:

- [ ] Cliente compra e paga
- [ ] Pedido é criado via webhook
- [ ] Lojista aceita pedido
- [ ] Lojista atualiza entrega
- [ ] Cliente acompanha status
- [ ] Todos os eventos críticos são registrados
- [ ] Não há quebra de permissão

---

## 13. Regra para AI Agent

1. Ler este PRD
2. Identificar a próxima task não marcada
3. Implementar **uma task por vez**
4. Commit pequeno e objetivo
5. Atualizar o PRD marcando a checkbox
6. Repetir até conclusão
