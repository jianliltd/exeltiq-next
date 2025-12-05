'use client';
import { useState, useMemo } from 'react';

import { ClientsHeader } from './header';
import { SearchFilter } from './search-filter';
import { ClientsContent } from './content';

import AddClientDialog from '../add-client-dialog';
import ImportClientsDialog from '../import-client-dialog/indev';

import { mockClients } from '../mock';

export const ClientsView = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter clients based on search term
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return mockClients;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return mockClients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerSearch) ||
        client.email.toLowerCase().includes(lowerSearch) ||
        client.phone.includes(searchTerm) ||
        client.company_name?.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

    // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <ClientsHeader
        onImportClick={() => setIsImportDialogOpen(true)}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Clients Grid/List */}
      <ClientsContent
        isLoading={isLoading}
        searchTerm={searchTerm}
        viewMode={viewMode}
        filteredClients={filteredClients}
        paginatedClients={paginatedClients}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddClientDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <ImportClientsDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
    </div>
  );
}