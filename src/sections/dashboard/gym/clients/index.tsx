"use client";

import { ClientsHeader } from "./header";
import { ClientsSearchbar } from "./searchbar";
import { ClientsContent } from "./content";
import { ClientAddDialog } from "./header/client-add-dialog";
import { useState } from "react";

type ViewMode = 'grid' | 'list';

interface GymClient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_sessions: number;
  sessions_used: number;
  sessions_remaining: number;
  // Additional fields for client details page compatibility
  company_name?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  budget?: number | null;
  preferences?: string | null;
  notes?: string | null;
  allergies?: string | null;
  createdAt?: string;
  updatedAt?: string;
  totalValue?: number;
  bookingsCount?: number;
  status?: string;
  totalSessions?: number;
  sessionsUsed?: number;
  sessionsRemaining?: number;
  deals?: Array<{ id: string; name: string; value: number; status: string }>;
  client_notes?: Array<{ 
    id: string; 
    note: string; 
    created_at: string; 
    created_by: string; 
    profiles: { first_name: string; last_name: string };
  }>;
  bookings?: Array<{ 
    id: string; 
    title: string; 
    schedule_date: string; 
    start_time: string; 
    end_time: string; 
    status: string; 
    description?: string;
    session_notes?: string;
  }>;
}

// Mock data for testing
const mockGymClients: GymClient[] = [
  {
    id: "gym-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+30 123 456 7890",
    total_sessions: 10,
    sessions_used: 3,
    sessions_remaining: 7,
    company_name: null,
    address: "123 Fitness Street",
    city: "Athens",
    country: "Greece",
    budget: 500,
    preferences: "Morning sessions",
    notes: "Very motivated client",
    allergies: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 300,
    bookingsCount: 3,
    status: "active",
    deals: [],
    client_notes: [
      { 
        id: '1', 
        note: 'Client is very consistent with workouts.', 
        created_at: '2024-11-15T08:00:00Z', 
        created_by: 'user_1', 
        profiles: { first_name: 'Trainer', last_name: 'John' } 
      },
    ],
    bookings: [
      { 
        id: 'b1', 
        title: 'HIIT Session', 
        schedule_date: '2025-01-15', 
        start_time: '09:00', 
        end_time: '10:00', 
        status: 'scheduled', 
        description: 'High intensity training' 
      },
    ],
  },
  {
    id: "gym-2",
    name: "Maria Papadopoulos",
    email: "maria.p@example.com",
    phone: "+30 234 567 8901",
    total_sessions: 20,
    sessions_used: 15,
    sessions_remaining: 5,
    company_name: null,
    address: "456 Gym Avenue",
    city: "Thessaloniki",
    country: "Greece",
    budget: 1000,
    preferences: "Evening sessions, Yoga",
    notes: "Prefers gentle exercises",
    allergies: null,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 600,
    bookingsCount: 15,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-3",
    name: "David Johnson",
    email: "david.j@example.com",
    phone: null,
    total_sessions: 5,
    sessions_used: 2,
    sessions_remaining: 3,
    company_name: null,
    address: null,
    city: "Athens",
    country: "Greece",
    budget: 250,
    preferences: null,
    notes: null,
    allergies: null,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 100,
    bookingsCount: 2,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-4",
    name: "Sofia Konstantinou",
    email: "sofia.k@example.com",
    phone: "+30 345 678 9012",
    total_sessions: 15,
    sessions_used: 10,
    sessions_remaining: 5,
    company_name: null,
    address: "789 Health Road",
    city: "Patras",
    country: "Greece",
    budget: 750,
    preferences: "Strength training",
    notes: "Training for marathon",
    allergies: null,
    createdAt: "2024-02-05T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 450,
    bookingsCount: 10,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-5",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+30 456 789 0123",
    total_sessions: 8,
    sessions_used: 8,
    sessions_remaining: 0,
    company_name: null,
    address: "321 Sport Lane",
    city: "Athens",
    country: "Greece",
    budget: 400,
    preferences: "Cardio workouts",
    notes: "Needs to renew package",
    allergies: null,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 240,
    bookingsCount: 8,
    status: "expired",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-6",
    name: "Elena Georgiou",
    email: "elena.g@example.com",
    phone: "+30 567 890 1234",
    total_sessions: 12,
    sessions_used: 4,
    sessions_remaining: 8,
    company_name: null,
    address: "654 Wellness Street",
    city: "Heraklion",
    country: "Greece",
    budget: 600,
    preferences: "Pilates, Stretching",
    notes: "Recovering from injury",
    allergies: null,
    createdAt: "2024-02-15T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 360,
    bookingsCount: 4,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-7",
    name: "Robert Williams",
    email: "robert.w@example.com",
    phone: "+30 678 901 2345",
    total_sessions: 25,
    sessions_used: 20,
    sessions_remaining: 5,
    company_name: null,
    address: "987 Fitness Plaza",
    city: "Athens",
    country: "Greece",
    budget: 1250,
    preferences: "CrossFit training",
    notes: "Advanced athlete",
    allergies: null,
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 750,
    bookingsCount: 20,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
  {
    id: "gym-8",
    name: "Anna Nikolaou",
    email: "anna.n@example.com",
    phone: null,
    total_sessions: 6,
    sessions_used: 1,
    sessions_remaining: 5,
    company_name: null,
    address: null,
    city: "Athens",
    country: "Greece",
    budget: 300,
    preferences: null,
    notes: "New member",
    allergies: null,
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-12-04T14:30:00Z",
    totalValue: 180,
    bookingsCount: 1,
    status: "active",
    deals: [],
    client_notes: [],
    bookings: [],
  },
];

export const Clients = () => {
  const [clients, setClients] = useState<GymClient[]>(mockGymClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<GymClient | null>(null);

  const handleRefreshClients = () => {
    // TODO: Fetch clients from API
    console.log("Refreshing clients list");
    setClients(mockGymClients);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setAddDialogOpen(true);
  };

  const handleEditClient = (client: GymClient) => {
    setEditingClient(client);
    setAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <ClientsHeader />
      
      <ClientsSearchbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ClientsContent
        clients={clients}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
        onRefresh={handleRefreshClients}
      />

      <ClientAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        editingClient={editingClient}
        onSuccess={handleRefreshClients}
      />
    </div>
  );
};
