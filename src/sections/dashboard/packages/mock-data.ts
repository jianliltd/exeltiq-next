export type Package = {
  id: string;
  title: string;
  description: string | null;
  session_count: number;
  price: number;
  created_at: string;
};

export const mockPackages: Package[] = [
  {
    id: "1",
    title: "Premium Membership",
    description: "Full gym access with unlimited classes and personal training sessions. Perfect for serious fitness enthusiasts.",
    session_count: 10,
    price: 99.99,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Basic Package",
    description: "Great for beginners! Includes 5 personal training sessions and gym access during off-peak hours.",
    session_count: 5,
    price: 49.99,
    created_at: "2024-01-20T14:20:00Z",
  },
  {
    id: "3",
    title: "Elite Training",
    description: null,
    session_count: 20,
    price: 179.99,
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    title: "Starter Pack",
    description: "Try out our gym with 3 sessions and basic access. No long-term commitment required.",
    session_count: 3,
    price: 29.99,
    created_at: "2024-02-10T16:45:00Z",
  },
];

