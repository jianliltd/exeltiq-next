import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useState } from "react";
import { useToast } from "@/hook/use-toast";

interface ClientImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

interface ExistingClient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

// Mock data for testing - clients that exist but don't have gym packages yet
const mockExistingClients: ExistingClient[] = [
  {
    id: "client-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+30 123 456 7890",
  },
  {
    id: "client-2",
    name: "Maria Papadopoulos",
    email: "maria.p@example.com",
    phone: "+30 234 567 8901",
  },
  {
    id: "client-3",
    name: "David Johnson",
    email: "david.j@example.com",
    phone: null,
  },
  {
    id: "client-4",
    name: "Sofia Konstantinou",
    email: "sofia.k@example.com",
    phone: "+30 345 678 9012",
  },
  {
    id: "client-5",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+30 456 789 0123",
  },
];

export const ClientImportDialog = ({ open, onOpenChange, onImportSuccess }: ClientImportDialogProps) => {
  const { t } = useTranslate();
  const { toast } = useToast();
  
  // Using mock data for testing
  const [existingClients] = useState<ExistingClient[]>(mockExistingClients);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
  const [importLoading, setImportLoading] = useState(false);

  const handleToggleClient = (clientId: string) => {
    setSelectedClients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const handleImportClients = async () => {
    setImportLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log("Importing clients:", Array.from(selectedClients));
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: t('gym.importSuccess', { 
          count: selectedClients.size,
          plural: selectedClients.size !== 1 ? 's' : ''
        }),
      });
      
      // Reset selection
      setSelectedClients(new Set());
      
      // Call success callback if provided
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing clients:", error);
      toast({
        title: t('gym.importError'),
        description: t('gym.importErrorMessage'),
        variant: "destructive",
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('gym.importExisting')}
          </DialogTitle>
          <DialogDescription>
            {t('gym.selectToImport')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {existingClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {t('gym.noClientsToImport')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('gym.allClientsHavePackages')}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {t('gym.selectClientsToImport')}
                </Label>
                
                <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                  {existingClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleToggleClient(client.id)}
                    >
                      <Checkbox
                        checked={selectedClients.has(client.id)}
                        onCheckedChange={() => handleToggleClient(client.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{client.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                        {client.phone && (
                          <p className="text-xs text-muted-foreground">{client.phone}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedClients.size > 0 && (
                  <p className="text-sm text-muted-foreground px-1">
                    ✓ {selectedClients.size} client{selectedClients.size > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  disabled={importLoading}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  onClick={handleImportClients} 
                  className="flex-1"
                  disabled={importLoading || selectedClients.size === 0}
                >
                  {importLoading 
                    ? t('common.importing') 
                    : `${t('common.import')} ${selectedClients.size > 0 ? `(${selectedClients.size})` : ''}`}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};