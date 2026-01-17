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
