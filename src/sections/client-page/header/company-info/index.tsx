import { CardTitle } from "@/components/ui/card";


import { Dumbbell, Mail, MapPin, Phone, Instagram, Facebook } from "lucide-react";


export const CompanyInfo = () => {
  const company = {
    logo_url: "/exeltiqlogo.svg",
    name: "FitLife Gym",
    email: "hello@fitlifegym.com",
    phone: "+1 (555) 123-4567",
    instagram_url: "https://www.instagram.com/fitlifegym",
    facebook_url: "https://www.facebook.com/fitlifegym",
    google_maps_url: "https://maps.google.com/?q=FitLife+Gym",
  };
  return (
    <div className="flex items-center gap-3 flex-1">
    {company?.logo_url ? (
      <img 
        src={company.logo_url} 
        alt={`${company.name} logo`}
        className="h-12 w-12 object-contain rounded-lg border flex-shrink-0"
      />
    ) : (
      <div className="p-2 bg-primary rounded-lg flex-shrink-0">
        <Dumbbell className="h-8 w-8 text-primary-foreground" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <CardTitle className="text-xl font-bold mb-1">{company?.name}</CardTitle>
      <div className="flex items-center gap-2 flex-wrap">
        {company?.email && (
          <a 
            href={`mailto:${company.email}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{company.email}</span>
          </a>
        )}
        {company?.phone && (
          <a 
            href={`tel:${company.phone}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{company.phone}</span>
          </a>
        )}
        {company?.instagram_url && (
          <a 
            href={company.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors group"
            title="Instagram"
          >
            <Instagram className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>
        )}
        {company?.facebook_url && (
          <a 
            href={company.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors group"
            title="Facebook"
          >
            <Facebook className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>
        )}
        {company?.google_maps_url && (
          <a 
            href={company.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors group"
            title="Location"
          >
            <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </a>
        )}
      </div>
    </div>
  </div>
  );
};