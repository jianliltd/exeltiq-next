import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ReactQuill from "react-quill-new";

import { Loader2, Send, ChevronDown} from "lucide-react";

import { toast } from "sonner";

import "react-quill-new/dist/quill.snow.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import useTranslate from "@/hook/use-translate";
import { EmailTemplate, Client } from "../type";
import { mockClients, mockTemplates } from "../mock";

export const ComposeEmail = () => {
  const { t } = useTranslate();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");
  const [recipientsOpen, setRecipientsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === "none") {
      setSubject("");
      setContent("");
    } else {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSubject(template.subject);
        setContent(template.content);
      }
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error(t('email.enterSubject'));
      return;
    }
    if (!content.trim()) {
      toast.error(t('email.enterContent'));
      return;
    }
    if (selectedClients.length === 0) {
      toast.error(t('email.selectOneClient'));
      return;
    }

    setIsSending(true);
    try {
      const selectedEmails = clients
        .filter(c => selectedClients.includes(c.id))
        .map(c => c.email);

      // TODO: Send email to selected clients

      toast.success(t('email.emailSent', { count: selectedEmails.length }));
      setSubject("");
      setContent("");
      setSelectedClients([]);
      setSelectedTemplateId("none");
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast.error(error.message || t('email.failedToSend'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('email.composeEmail')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('email.senderEmail')}</Label>
            <Input value="noreply@exeltive.com" disabled />
          </div>

          {templates.length > 0 && (
            <div className="space-y-2">
              <Label>{t('email.useTemplate')}</Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder={t('email.none')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('email.none')}</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('email.recipients')}</Label>
              {clients.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  type="button"
                  className="h-auto p-0 text-xs text-primary hover:text-primary/10"
                >
                  {selectedClients.length === clients.length ? t('email.deselectAll') : t('email.selectAll')}
                </Button>
              )}
            </div>
            
            <Popover open={recipientsOpen} onOpenChange={setRecipientsOpen}>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={recipientsOpen}
                  className="w-full justify-between h-auto min-h-[40px] py-2"
                >
                  <div className="flex flex-wrap gap-1 flex-1 text-left">
                    {selectedClients.length === 0 ? (
                      <span className="text-muted-foreground">{t('email.selectRecipients')}</span>
                    ) : (
                      <>
                        {selectedClients.slice(0, 3).map((clientId) => {
                          const client = clients.find(c => c.id === clientId);
                          return client ? (
                            <Badge key={clientId} variant="secondary" className="text-xs">
                              {client.name}
                            </Badge>
                          ) : null;
                        })}
                        {selectedClients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{selectedClients.length - 3} more
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0 bg-background" 
                align="start" 
                sideOffset={4}
              >
                {isLoadingClients ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : clients.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8 px-4">
                    {t('email.noClientsWithEmail')}
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto p-2">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => handleClientToggle(client.id)}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => handleClientToggle(client.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none truncate">
                            {client.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            {selectedClients.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t('email.recipientsSelected', { count: selectedClients.length })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t('email.subject')}</Label>
            <Input
              id="subject"
              placeholder={t('email.subjectPlaceholder')}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t('email.emailContent')}</Label>
            <div className="h-[300px] sm:h-[350px] overflow-hidden flex flex-col">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder={t('email.emailPlaceholder')}
                className="flex-1 flex flex-col bg-background [&_.ql-container]:flex-1 [&_.ql-editor]:overflow-y-auto"
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
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSend}
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('email.sending')}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t('email.sendEmail')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
