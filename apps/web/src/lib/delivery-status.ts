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
