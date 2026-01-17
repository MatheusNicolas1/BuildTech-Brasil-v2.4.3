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
