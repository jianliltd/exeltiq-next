export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  address: string;
  city: string;
  country: string;
  budget: number;
  preferences: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  bookingsCount: number;
  status: string;
  totalSessions: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  deals: any[];
  allergies: string;
  client_notes: any[];
  bookings: any[];
}