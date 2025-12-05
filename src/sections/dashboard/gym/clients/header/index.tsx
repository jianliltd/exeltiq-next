import useTranslate from "@/hook/use-translate";
import { ClientImportDialog } from "./client-import-dialog";
import { ClientAddDialog } from "./client-add-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export const ClientsHeader = () => {
  const { t } = useTranslate();
  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{t('gym.gymClients')}</h2>
          <p className="text-sm text-muted-foreground">{t('gym.manageClientSessions')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setImportOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('gym.import')}
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => setAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('gym.addClient')}
          </Button>
        </div>
      </div>
      
      <ClientImportDialog 
        open={importOpen} 
        onOpenChange={setImportOpen}
        onImportSuccess={() => {
          // TODO: Refresh clients list after import
          console.log("Clients imported successfully");
        }}
      />

      <ClientAddDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => {
          // TODO: Refresh clients list after adding
          console.log("Client added successfully");
        }}
      />
    </div>
  );
};
