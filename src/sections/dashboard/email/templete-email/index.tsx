import { useState } from "react";

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import useTranslate from "@/hook/use-translate";

import { EmailTemplate } from "../type";
import { mockTemplates } from "../mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTempleteDialog } from "../add-templete-dialog";
import { DeleteTempleteDialog } from "../delete-templete-dialog";

export const TempleteEmail = () => {
  const { t } = useTranslate();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [isLoading, setIsLoading] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCreate = () => {
    setSelectedTemplate(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // TODO: Delete template
  };

  const handleSave = async (data: { name: string; subject: string; content: string }) => {
    // TODO: Save template
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold">{t('email.emailTemplates')}</h2>
          <p className="text-sm text-muted-foreground">{t('email.manageTemplates')}</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {t('email.newTemplate')}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              {t('email.noTemplates')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('email.subjectLabel')}</p>
                  <p className="text-sm">{template.subject}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="flex-1"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {t('email.edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(template.id)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('email.delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <AddTempleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={selectedTemplate}
        onSave={handleSave}
      />
      <DeleteTempleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};