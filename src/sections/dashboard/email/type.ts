export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
}