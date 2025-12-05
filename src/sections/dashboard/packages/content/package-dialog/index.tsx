import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useTranslate from "@/hook/use-translate";
import { useState, useEffect } from "react";
import { ChevronDown, Users } from "lucide-react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup } from "@/components/ui/command";

type Package = {
  id: string;
  title: string;
  description: string | null;
  session_count: number;
  price: number;
  created_at: string;
};

type PackageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPackage: Package | null;
  onSuccess: () => void;
};

export const PackageDialog = ({ open, onOpenChange, editingPackage, onSuccess }: PackageDialogProps) => {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    session_count: "",
    price: "",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);

  // Reset form when dialog opens/closes or when editing package changes
  useEffect(() => {
    if (editingPackage) {
      setFormData({
        title: editingPackage.title,
        description: editingPackage.description || "",
        session_count: editingPackage.session_count.toString(),
        price: editingPackage.price.toString(),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        session_count: "",
        price: "",
      });
    }
  }, [editingPackage, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual API call here
      console.log("Submitting package:", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving package:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingPackage ? t('packages.editPackage') : t('packages.createPackage')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {editingPackage 
              ? t('packages.updatePackageDesc') 
              : t('packages.createPackageDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              {t('packages.titleLabel')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('packages.titlePlaceholder')}
              required
              className="h-11"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              {t('packages.descriptionLabel')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('packages.descriptionPlaceholder')}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Session Count and Price Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_count" className="text-sm font-medium">
                {t('packages.sessionCountLabel')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="session_count"
                type="number"
                min="1"
                value={formData.session_count}
                onChange={(e) => setFormData({ ...formData, session_count: e.target.value })}
                placeholder={t('packages.sessionCountPlaceholder')}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                {t('packages.priceLabel')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder={t('packages.pricePlaceholder')}
                required
                className="h-11"
              />
            </div>
          </div>

          {/* Assign to Clients Section - Styled like screenshot */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-foreground" />
              <Label className="text-sm font-medium m-0">
                {t('packages.assignToClients')}
              </Label>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('packages.assignToClientsDesc')}
            </p>
            
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full h-11 justify-between bg-background hover:bg-accent text-foreground font-normal border-input"
                >
                  <span className="text-muted-foreground">
                    {selectedClientIds.length > 0
                      ? t('packages.clientsSelected', { 
                          count: selectedClientIds.length, 
                          plural: selectedClientIds.length > 1 ? 's' : '' 
                        })
                      : t('packages.selectClients')}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder={t('packages.searchClientsPlaceholder')} />
                  <CommandList>
                    <CommandEmpty>{t('packages.noClientFound')}</CommandEmpty>
                    <CommandGroup>
                      {/* Client items will be mapped here */}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected clients as chips */}
            {selectedClientIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedClientIds.map((clientId) => (
                  <Badge
                    key={clientId}
                    variant="secondary"
                    className="pl-3 pr-1 py-1.5 text-sm"
                  >
                    {clientId}
                    <button
                      type="button"
                      onClick={() => setSelectedClientIds(selectedClientIds.filter((id) => id !== clientId))}
                      className="ml-1.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2 sm:gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-10 px-6"
            >
              {t('packages.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="h-10 px-6 bg-primary hover:bg-primary/90"
            >
              {loading ? t('packages.saving') : editingPackage ? t('packages.updatePackage') : t('packages.createPackage')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};