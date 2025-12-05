'use client';

import { ClientDetailInfo } from './client-detail';
import { ContactInfo } from './contact-info';

import { Client } from '../../type';

interface ClientInfoProps {
  client: Client;
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
      <ContactInfo client={client} />
      <ClientDetailInfo client={client} />
    </div>
  );
};
