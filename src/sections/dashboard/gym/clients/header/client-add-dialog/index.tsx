"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import useTranslate from "@/hook/use-translate";
import { useState, useEffect } from "react";
import { useToast } from "@/hook/use-toast";

interface ClientAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient?: GymClient | null;
  onSuccess?: () => void;
}

interface GymClient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  total_sessions: number;
  sessions_used: number;
  sessions_remaining: number;
}

export const ClientAddDialog = ({ 
  open, 
  onOpenChange, 
  editingClient = null, 
  onSuccess 
}: ClientAddDialogProps) => {
  const { t } = useTranslate();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setShowPassword(false);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingClient && open) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setPhone(editingClient.phone || "");
      setPassword(""); 
    } else if (!open) {
      resetForm();
    }
  }, [editingClient, open]);

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: t('gym.validationError'),
        description: t('gym.nameRequired'),
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: t('gym.validationError'),
        description: t('gym.emailRequired'),
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: t('gym.validationError'),
        description: t('gym.invalidEmail'),
        variant: "destructive",
      });
      return false;
    }

    if (!editingClient && !password.trim()) {
      toast({
        title: t('gym.validationError'),
        description: t('gym.passwordRequired'),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveClient = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const clientData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        ...(password && { password }), // Only include password if provided
      };

      if (editingClient) {
        console.log("Updating client:", editingClient.id, clientData);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast({
          title: t('gym.clientUpdated'),
          description: t('gym.clientUpdatedSuccessfully'),
        });
      } else {
        console.log("Creating client:", clientData);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast({
          title: t('gym.clientAdded'),
          description: t('gym.clientAddedSuccessfully'),
        });
      }

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close dialog
      onOpenChange(false);
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: t('gym.error'),
        description: editingClient 
          ? t('gym.clientUpdateError') 
          : t('gym.clientAddError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? t('gym.editClient') : t('gym.addNewClient')}
          </DialogTitle>
          <DialogDescription>
            {t('gym.setupSessionPackage')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('gym.name')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('gym.namePlaceholder')}
              disabled={loading}
              className="h-10"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('gym.email')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('gym.emailPlaceholder')}
              disabled={loading || !!editingClient} // Disable email when editing
              className="h-10"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              {t('gym.phone')}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('gym.phonePlaceholder')}
              disabled={loading}
              className="h-10"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t('gym.password')}
              {!editingClient && <span className="text-destructive"> *</span>}
              {editingClient && (
                <span className="text-xs text-muted-foreground ml-2">
                  ({t('gym.leaveEmptyToKeep')})
                </span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('gym.passwordPlaceholder')}
                disabled={loading}
                className="h-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 h-10"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSaveClient} 
            disabled={loading}
            className="flex-1 h-10"
          >
            {loading 
              ? t('common.saving') 
              : editingClient 
                ? t('gym.editInfo') 
                : t('gym.addClient')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

