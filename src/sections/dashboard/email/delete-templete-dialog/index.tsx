import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useTranslate from "@/hook/use-translate";

interface DeleteTempleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteTempleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteTempleteDialogProps) => {
  const { t } = useTranslate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('email.deleteTemplate')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('email.deleteTemplateConfirm')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('email.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('email.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

