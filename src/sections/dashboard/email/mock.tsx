import { Client, EmailTemplate } from './type';

export const mockClients: Client[] = [
  { id: 'c1', name: 'Maria Papadopoulos', email: 'maria.papadopoulos@email.com' },
  { id: 'c2', name: 'Nikos Georgiou', email: 'nikos.georgiou@email.com' },
  { id: 'c3', name: 'Elena Stavrou', email: 'elena.stavrou@email.com' },
  { id: 'c4', name: 'Dimitris Kosta', email: 'dimitris.kosta@email.com' },
  { id: 'c5', name: 'Sofia Alexandrou', email: 'sofia.alexandrou@email.com' },
  { id: 'c6', name: 'Yannis Nikolaou', email: 'yannis.nikolaou@email.com' },
  { id: 'c7', name: 'Anna Michaelides', email: 'anna.michaelides@email.com' },
  { id: 'c8', name: 'Kostas Papanikolaou', email: 'kostas.papanikolaou@email.com' },
];

export const mockTemplates: EmailTemplate[] = [
  {
    id: 't1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Gym!',
    content: '<p><b>Welcome!</b></p><p><br></p><p>We are thrilled to have you as a member of our fitness family. Your journey to a healthier lifestyle starts now!</p><p>If you have any questions, feel free to reach out to us.</p><p><br></p><p>Best regards,</p><p>The Gym Team</p>',
    created_at: '2025-11-01T10:00:00Z',
  },
  {
    id: 't2',
    name: 'Membership Renewal',
    subject: 'Your Membership is Expiring Soon',
    content: '<p><b>Membership Renewal Reminder</b></p><p><br></p><p>Your membership will expire soon. Renew now to maintain uninterrupted access to our facilities and services.</p><p>Contact us or visit our team to renew your membership today.</p><p><br></p><p>Best regards,</p><p>The Gym Team</p>',
    created_at: '2025-11-15T14:30:00Z',
  },
  {
    id: 't3',
    name: 'Special Promotion',
    subject: 'Exclusive Offer Just for You!',
    content: '<p><b>Special Promotion!</b></p><p><br></p><p>As a valued member, we have an exclusive offer just for you. Upgrade your membership or refer a friend and receive special discounts.</p><p>Don\'t miss out on this limited-time offer!</p><p><br></p><p>Best regards,</p><p>The Gym Team</p>',
    created_at: '2025-11-20T09:15:00Z',
  },
  {
    id: 't4',
    name: 'Class Schedule Update',
    subject: 'New Classes Added to the Schedule',
    content: '<p><b>New Classes Available!</b></p><p><br></p><p>We\'ve added exciting new classes to our schedule. Check out our updated timetable and book your spot today!</p><p>See you at the gym!</p><p><br></p><p>Best regards,</p><p>The Gym Team</p>',
    created_at: '2025-12-01T16:45:00Z',
  },
];
