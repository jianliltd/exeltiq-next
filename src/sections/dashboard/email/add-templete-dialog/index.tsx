import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import ReactQuill from "react-quill-new";
import { useTranslation } from "react-i18next";

interface AddTempleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: {
    id: string;
    name: string;
    subject: string;
    content: string;
  };
  onSave: (data: { name: string; subject: string; content: string }) => Promise<void>;
}

export function AddTempleteDialog({ open, onOpenChange, template, onSave }: AddTempleteDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setContent(template.content);
    } else {
      setName("");
      setSubject("");
      setContent("");
    }
  }, [template, open]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ name, subject, content });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted/80">
        <DialogHeader>
          <DialogTitle>{template ? t('email.editTemplate') : t('email.createTemplate')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label htmlFor="name">{t('email.templateName')}</Label>
            <Input
              id="name"
              placeholder={t('email.templateNamePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="subject">{t('email.subject')}</Label>
            <Input
              id="subject"
              placeholder={t('email.emailSubject')}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-3 mb-16">
            <Label htmlFor="content">{t('email.content')}</Label>
            <div className="w-full max-w-full">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder={t('email.writeTemplateContent')}
                className="bg-background w-full"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, { background: [] }],
                    ["link"],
                    ["clean"],
                  ],
                }}
                style={{ height: "200px", marginBottom: "42px", width: "100%" }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('email.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name || !subject || !content}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('email.saving')}
              </>
            ) : (
              template ? t('email.updateTemplate') : t('email.createTemplate')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
