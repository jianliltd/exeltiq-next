"use client";

import useTranslate from "@/hook/use-translate";

import { useState } from "react";

import { Plus } from "lucide-react";
import { Edit, Trash2 } from "lucide-react";    

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { mockPackages, type Package } from "../mock-data";

import { PackageDialog } from "./package-dialog";

export const PackagesContent = () => {  
  const { t } = useTranslate();
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  
  // Using mock data for testing
  const [packages, setPackages] = useState<Package[]>(mockPackages);

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleCreatePackage = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (packageToDelete) {
      setLoading(true);
      // TODO: Delete package
      setLoading(false);
    }
  };

  const fetchPackages = () => {
    // TODO: Fetch packages from API
    // For now, using mock data
    setPackages(mockPackages);
  };

  return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('packages.title')}</h1>
            <p className="text-muted-foreground">{t('packages.subtitle')}</p>
          </div>
          <Button onClick={handleCreatePackage}>
            <Plus className="h-4 w-4 mr-2" />
            {t('packages.createPackage')}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t('packages.loadingPackages')}</div>
        ) : packages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{t('packages.noPackages')}</p>
              <Button onClick={handleCreatePackage}>
                <Plus className="h-4 w-4 mr-2" />
                {t('packages.createFirstPackage')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{pkg.title}</CardTitle>
                      <Badge variant="secondary">{pkg.session_count} {t('packages.sessions')}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      €{pkg.price}
                    </div>
                  </div>
                  {pkg.description && (
                    <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('packages.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteClick(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('packages.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
            ))}
          </div>
        )}
        <PackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingPackage={editingPackage}
        onSuccess={fetchPackages}
        />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('packages.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('packages.deleteMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('packages.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>{t('packages.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
      
  );
};