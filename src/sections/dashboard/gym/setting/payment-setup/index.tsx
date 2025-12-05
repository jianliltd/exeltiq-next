"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTranslate from "@/hook/use-translate";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


export const PaymentSetup = () => {
  const { t } = useTranslate();
  const [stripeOnboarding, setStripeOnboarding] = useState({
    loading: false,
    completed: true,
    hasAccount: false,
  });
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const handleDisconnectStripe = () => {
    setStripeOnboarding({
      loading: false,
      completed: false,
      hasAccount: false,
    });
  };
  const handleStripeConnect = () => {
    setStripeOnboarding({
      loading: false,
      completed: false,
      hasAccount: false,
    });
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle title="stripe-connect-title">{t('gym.stripeConnectTitle')}</CardTitle>
          <CardDescription>{t('gym.stripeConnectDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stripeOnboarding.loading ? (
            <div className="text-center py-4 text-muted-foreground">
              {t('common.loading')}
            </div>
          ) : stripeOnboarding.completed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {t('gym.stripeConnectActive')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('gym.stripeConnectActiveDesc')}
              </p>
              <Button 
                onClick={() => setShowDisconnectDialog(true)}
                disabled={stripeOnboarding.loading}
                variant="destructive"
                className="w-full"
              >
                {t('gym.disconnectStripe')}
              </Button>
              
              <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('gym.disconnectStripe')}</DialogTitle>
                    <DialogDescription>
                      {t('gym.confirmDisconnectStripe')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDisconnectDialog(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDisconnectStripe}
                    disabled={stripeOnboarding.loading}
                  >
                    {t('common.confirm')}
                  </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  {stripeOnboarding.hasAccount ? t('gym.stripeConnectPending') : t('gym.stripeConnectNotSetup')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('gym.stripeConnectSetupDesc')}
              </p>
              <Button 
                onClick={handleStripeConnect} 
                disabled={stripeOnboarding.loading}
                className="w-full"
              >
                {stripeOnboarding.hasAccount ? t('gym.continueStripeSetup') : t('gym.setupStripeConnect')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};