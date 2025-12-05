import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useTranslate from '@/hook/use-translate';

import { ComposeEmail } from "./compose-email";
import { TempleteEmail } from "./templete-email";

export const EmailView = () => {
  const { t } = useTranslate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('email.title')}</h1>
        <p className="text-muted-foreground">{t('email.subtitle')}</p>
      </div>
      <Tabs defaultValue="compose" className="w-full">
        <TabsList>
          <TabsTrigger value="compose">{t('email.compose')}</TabsTrigger>
          <TabsTrigger value="templates">{t('email.templates')}</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <ComposeEmail />
        </TabsContent>
        <TabsContent value="templates">
          <TempleteEmail />
        </TabsContent>
      </Tabs>
    </div>
  );
}
