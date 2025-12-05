import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hook/use-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, FileText } from "lucide-react";

import { useTranslation } from "react-i18next";

interface ImportClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportClientsDialog({ open, onOpenChange }: ImportClientsDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: t("importClients.invalidFile"),
        description: t("importClients.invalidFileDescription"),
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: t("importClients.noFileSelected"),
        description: t("importClients.noFileSelectedDescription"),
        variant: "destructive",
      });
      return;
    }
    // importMutation.mutate(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("importClients.title")}</DialogTitle>
          <DialogDescription>
            {t("importClients.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{t("importClients.clickToChange")}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium">{t("importClients.clickToUpload")}</p>
                  <p className="text-sm text-muted-foreground">{t("importClients.orDragDrop")}</p>
                </div>
              )}
            </label>
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">{t("importClients.formatExample")}</p>
            <code className="block text-xs">
              name,email,phone,company,budget<br />
              John Doe,john@example.com,+1234567890,Acme Corp,$5000<br />
              Jane Smith,jane@example.com,+0987654321,Tech Inc,$10000
            </code>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("importClients.cancel")}
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file}
            >
              {t("importClients.importButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
