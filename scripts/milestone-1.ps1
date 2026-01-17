$ErrorActionPreference = "Stop"
Write-Host "== Milestone 1: Dashboard + Orders scaffold =="

$layoutPath = "apps/web/src/app/(dashboard)/layout.tsx"
$homePath   = "apps/web/src/app/(dashboard)/dashboard/page.tsx"
$libDir     = "apps/web/src/lib"
$statusPath = "$libDir/delivery-status.ts"
$ordersDir  = "apps/web/src/app/(dashboard)/dashboard/pedidos"
$ordersPage = "$ordersDir/page.tsx"

New-Item -ItemType Directory -Force (Split-Path $layoutPath) | Out-Null
New-Item -ItemType Directory -Force (Split-Path $homePath) | Out-Null
New-Item -ItemType Directory -Force $libDir | Out-Null
New-Item -ItemType Directory -Force $ordersDir | Out-Null

@'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #eee" }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Painel do Lojista</div>
        <nav style={{ display: "grid", gap: 8 }}>
          <a href="/dashboard">Visão geral</a>
          <a href="/dashboard/pedidos">Pedidos</a>
          <a href="/dashboard/produtos">Produtos</a>
          <a href="/dashboard/entregas">Entregas</a>
        </nav>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 $layoutPath

@'
export default function DashboardHome() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>Status: base do painel criada. Próximo: fluxo de pedidos e estados.</p>
    </>
  );
}
'@ | Set-Content -Encoding UTF8 $homePath

@'
export type DeliveryStatus =
  | "PLACED"
  | "CONFIRMED"
  | "SEPARATING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  PLACED: "Pedido realizado",
  CONFIRMED: "Confirmado",
  SEPARATING: "Separando",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};
'@ | Set-Content -Encoding UTF8 $statusPath

@'
import { DELIVERY_STATUS_LABEL, type DeliveryStatus } from "@/lib/delivery-status";

const MOCK: Array<{ id: string; status: DeliveryStatus; total: number }> = [
  { id: "PED-1001", status: "PLACED", total: 189.9 },
  { id: "PED-1002", status: "SEPARATING", total: 72.5 },
  { id: "PED-1003", status: "OUT_FOR_DELIVERY", total: 410.0 }
];

export default function PedidosPage() {
  return (
    <>
      <h1>Pedidos</h1>
      <p>Lista inicial (mock) para validar estados de entrega no painel.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Pedido</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Status</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map((o) => (
            <tr key={o.id}>
              <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{o.id}</td>
              <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8 }}>{DELIVERY_STATUS_LABEL[o.status]}</td>
              <td style={{ borderBottom: "1px solid #f3f3f3", padding: 8, textAlign: "right" }}>{o.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
'@ | Set-Content -Encoding UTF8 $ordersPage

node -e "const fs=require('fs'); const p='apps/web/package.json'; const j=JSON.parse(fs.readFileSync(p,'utf8')); j.scripts=j.scripts||{}; j.scripts.dev='next dev --webpack'; fs.writeFileSync(p, JSON.stringify(j,null,2)+require('os').EOL); console.log('apps/web dev:', j.scripts.dev);"

npm run typecheck
npm run lint

Write-Host "== Milestone 1 applied. =="
Write-Host "Open: http://localhost:3000/dashboard and /dashboard/pedidos"
