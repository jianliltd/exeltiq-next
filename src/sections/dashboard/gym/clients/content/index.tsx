"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Edit, 
  Package, 
  Eye, 
  UserPlus, 
  Loader2,
  Mail,
  Phone
} from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hook/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GymClient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_sessions: number;
  sessions_used: number;
  sessions_remaining: number;
}

interface Package {
  id: string;
  title: string;
  session_count: number;
  price: number;
  description?: string;
}

interface ClientsContentProps {
  clients: GymClient[];
  searchTerm: string;
  viewMode: 'grid' | 'list';
  onAddClient: () => void;
  onEditClient: (client: GymClient) => void;
  onRefresh: () => void;
}

export const ClientsContent = ({
  clients,
  searchTerm,
  viewMode,
  onAddClient,
  onEditClient,
}: ClientsContentProps) => {
  const { t } = useTranslate();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mounted, setMounted] = useState(false);
  const [sendingInviteId, setSendingInviteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<GymClient | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);

  const clientName = selectedClient?.name || "";
  const currentSessions = {
    total: selectedClient?.total_sessions || 0,
    used: selectedClient?.sessions_used || 0,
    remaining: selectedClient?.sessions_remaining || 0,
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter((client) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      (client.phone && client.phone.toLowerCase().includes(searchLower))
    );
  });

  const handleSendInviteEmail = async (client: GymClient) => {
    setSendingInviteId(client.id);
    
    try {
      // TODO: Implement actual API call
      console.log("Sending invite email to:", client.email);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: t('gym.invitationSent'),
        description: t('gym.emailSentTo', { email: client.email }),
      });
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: t('gym.errorSendingInvite'),
        description: t('common.tryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setSendingInviteId(null);
    }
  };

  const handleViewDetails = (clientId: string) => {
    // Navigate to client details page
    router.push(`/dashboard/clients/view-detail/${clientId}`);
  };

  const handleAddSessions = async (client: GymClient) => {
    setSelectedClient(client);
    setOpen(true);
    setLoading(true);
    
    try {
      // TODO: Implement actual API call to fetch packages
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock packages data - replace with actual API call
      // Note: In production, package titles/descriptions should come from the backend
      // or use i18n keys stored in the database
      setPackages([
        { 
          id: '1', 
          title: t('gym.basicPackage'), 
          session_count: 10, 
          price: 100, 
          description: t('gym.basicPackageDesc') 
        },
        { 
          id: '2', 
          title: t('gym.standardPackage'), 
          session_count: 20, 
          price: 180, 
          description: t('gym.standardPackageDesc') 
        },
        { 
          id: '3', 
          title: t('gym.premiumPackage'), 
          session_count: 30, 
          price: 250, 
          description: t('gym.premiumPackageDesc') 
        },
      ]);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast({
        title: t('gym.errorLoadingPackages'),
        description: t('common.tryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPackage = async () => {
    if (!selectedPackage || !selectedClient) return;
    
    setAssigning(true);
    try {
      // TODO: Implement actual API call to assign package
      console.log("Assigning package:", selectedPackage, "to client:", selectedClient.id);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t('gym.sessionsAdded'),
        description: t('gym.sessionsAddedSuccessfully'),
      });
      
      // Close dialog and reset
      setOpen(false);
      setSelectedClient(null);
      setSelectedPackage("");
    } catch (error) {
      console.error("Error assigning package:", error);
      toast({
        title: t('gym.errorAssigningPackage'),
        description: t('common.tryAgainLater'),
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedClient(null);
      setSelectedPackage("");
      setPackages([]);
    }
  };

  // Render Add Sessions Dialog
  const renderAddSessionsDialog = () => {
    // Prevent hydration mismatch by only rendering dialog after mount
    if (!mounted) return null;
    
    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('gym.addSessionsTo', { name: clientName })}</DialogTitle>
          <DialogDescription>
            {t('gym.selectPackageDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">{t('gym.currentSessionStatus')}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span>{t('gym.total')}: <strong>{currentSessions.total}</strong></span>
              <span>{t('gym.used')}: <strong>{currentSessions.used}</strong></span>
              <span>{t('gym.remaining')}: <strong>{currentSessions.remaining}</strong></span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">{t('gym.loadingPackages')}</div>
          ) : packages.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">{t('gym.noPackagesAvailable')}</p>
              <p className="text-sm text-muted-foreground">{t('gym.createPackagesFirst')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('gym.selectPackageLabel')}</label>
                  <Select value={selectedPackage || ""} onValueChange={setSelectedPackage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('gym.selectPackagePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg: Package) => (
                        <SelectItem key={pkg.id} value={pkg.id} className="cursor-pointer">
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{pkg.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {pkg.session_count} {t('gym.sessions')}
                              </Badge>
                            </div>
                            <span className="font-bold ml-auto">${pkg.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPackage && (
                  <>
                    {packages.find((p: Package) => p.id === selectedPackage)?.description && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {packages.find((p: Package) => p.id === selectedPackage)?.description}
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">{t('gym.afterAssigning')}</p>
                      <div className="flex gap-4 text-sm">
                        <span>
                          {t('gym.total')}: <strong>
                            {currentSessions.total + (packages.find((p: Package) => p.id === selectedPackage)?.session_count || 0)}
                          </strong>
                        </span>
                        <span>{t('gym.remaining')}: <strong>
                            {currentSessions.remaining + (packages.find((p: Package) => p.id === selectedPackage)?.session_count || 0)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={handleAssignPackage}
                disabled={!selectedPackage || assigning}
                className="w-full"
              >
                {assigning ? t('gym.adding') : t('gym.addSessions')}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    );
  };

  // Empty state when no clients
  if (filteredClients.length === 0) {
    return (
      <>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">
            {searchTerm ? t('gym.noClientsFound') : t('gym.noGymClients')}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? t('gym.tryDifferentSearch') : t('gym.addFirstClient')}
          </p>
          {!searchTerm && (
            <Button onClick={onAddClient}>
              <Plus className="h-4 w-4 mr-2" />
              {t('gym.addClient')}
            </Button>
          )}
        </CardContent>
      </Card>
        {renderAddSessionsDialog()}
      </>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{client.name}</span>
                <Badge variant={client.sessions_remaining > 0 ? "default" : "destructive"}>
                  {client.sessions_remaining} {t('gym.left')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span>{client.phone}</span>
                </div>
              )}
              
              {/* Session Status */}
              <div className="bg-muted p-3 sm:p-4 rounded-lg">
                <p className="text-sm font-medium mb-2 text-primary text-center">
                  {t('gym.sessionStatus')}
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  <div>
                    <span className="block text-muted-foreground text-xs">
                      {t('gym.total')}
                    </span>
                    <strong>{client.total_sessions}</strong>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-xs">
                      {t('gym.used')}
                    </span>
                    <strong>{client.sessions_used}</strong>
                  </div>
                  <div>
                    <span className="block text-muted-foreground text-xs">
                      {t('gym.left')}
                    </span>
                    <strong>{client.sessions_remaining}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 !mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs whitespace-normal h-auto py-2"
                    size="sm"
                    onClick={() => onEditClient(client)}
                  >
                    <Edit className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="text-center">{t('gym.editInfo')}</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full text-xs whitespace-normal h-auto py-2"
                    size="sm"
                    onClick={() => handleAddSessions(client)}
                  >
                    <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="text-center">{t('gym.addSessions')}</span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs whitespace-normal h-auto py-2"
                    size="sm"
                    onClick={() => handleViewDetails(client.id)}
                  >
                    <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="text-center">{t('gym.viewDetails')}</span>
                  </Button>
                  <Button 
                    variant="default"
                    className="w-full text-xs whitespace-normal h-auto py-2"
                    size="sm" 
                    onClick={() => handleSendInviteEmail(client)}
                    disabled={sendingInviteId === client.id}
                  >
                    {sendingInviteId === client.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin flex-shrink-0" />
                        <span className="text-center">{t('gym.sending')}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="text-center">{t('gym.inviteClient')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {renderAddSessionsDialog()}
    </>
    );
  }

  // List view
  return (
    <>
    <Card className="shadow-elevated border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                {/* Left: Client Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0 w-full lg:w-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">
                      {client.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {client.name}
                      </h3>
                      <Badge variant={client.sessions_remaining > 0 ? "default" : "destructive"}>
                        {client.sessions_remaining} {t('gym.left')}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Session Status */}
                <div className="flex flex-col items-center bg-muted p-3 rounded-lg w-full lg:w-auto">
                  <p className="text-xs font-medium text-primary mb-2">
                    {t('gym.sessionStatus')}
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-sm text-center">
                    <div>
                      <span className="block text-muted-foreground text-xs">
                        {t('gym.total')}
                      </span>
                      <strong>{client.total_sessions}</strong>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs">
                        {t('gym.used')}
                      </span>
                      <strong>{client.sessions_used}</strong>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-xs">
                        {t('gym.left')}
                      </span>
                      <strong>{client.sessions_remaining}</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="grid grid-cols-2 gap-2 w-full lg:w-auto lg:min-w-[280px]">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs whitespace-normal h-auto py-2"
                    onClick={() => onEditClient(client)}
                  >
                    <Edit className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{t('gym.editInfo')}</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs whitespace-normal h-auto py-2"
                    onClick={() => handleAddSessions(client)}
                  >
                    <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{t('gym.addSessions')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs whitespace-normal h-auto py-2"
                    onClick={() => handleViewDetails(client.id)}
                  >
                    <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{t('gym.viewDetails')}</span>
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    className="text-xs whitespace-normal h-auto py-2"
                    onClick={() => handleSendInviteEmail(client)}
                    disabled={sendingInviteId === client.id}
                  >
                    {sendingInviteId === client.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin flex-shrink-0" />
                        <span>{t('gym.sending')}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{t('gym.inviteClient')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Add Sessions Dialog */}
    {renderAddSessionsDialog()}
  </>
  );
};

