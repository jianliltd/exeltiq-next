export interface RevenueRecord {
  id: string;
  amount: number;
  package_type: string;
  payment_type: string;
  created_at: string;
  client_id: string;
  clients: {
    name: string;
  };
}

export interface RevenueMetrics {
  daily: number;
  monthly: number;
  yearly: number;
  total: number;
  topClients: { name: string; total: number }[];
}