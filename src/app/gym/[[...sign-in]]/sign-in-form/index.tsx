"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle,CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Dumbbell, EyeOff, Eye, Loader2, Mail, Phone } from "lucide-react";

import useTranslate from "@/hook/use-translate";



export default function SlugInForm() {
  const [company, setCompany] = useState<{ logo_url: string; name: string; email: string; phone: string } | null>(null);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setLoggingIn(true);
    console.log("Logging in with phone:", phone);
    setLoggingIn(false);
  }

  const { t } = useTranslate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt={`${company.name || 'Gym'} logo`}
                className="h-20 w-20 object-contain rounded-lg border flex-shrink-0 p-1"
              />
            ) : (
              <div className="p-4 bg-primary/10 rounded-full">
                <Dumbbell className="h-12 w-12 text-primary" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            exeltiQ
          </CardTitle>
          <CardDescription>Login to book your sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "phone" | "email")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">{t("gymBooking.phone")}</TabsTrigger>
              <TabsTrigger value="email">{t("gymBooking.email")}</TabsTrigger>
            </TabsList>
            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("gymBooking.phoneNumber")}</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
                    disabled={loggingIn}
                    autoComplete="tel"
                  />
              </div>
              <Button onClick={handleLogin} disabled={loggingIn || !phone.trim()} className="w-full">
                {loggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("gymBooking.loggingIn")}
                  </>
                ) : t("gymBooking.login")}
              </Button>
            </TabsContent>
            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("gymBooking.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loggingIn}
                  autoComplete="email"
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("gymBooking.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !loggingIn && handleLogin()}
                  disabled={loggingIn}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loggingIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
              <Button onClick={handleLogin} disabled={loggingIn || !email.trim() || !password.trim()} className="w-full">
                    {loggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {t("gymBooking.loggingIn")}
                      </>
                    ) : t("gymBooking.login")}
              </Button>
            </TabsContent>
          </Tabs>     
          <p className="text-xs text-center text-muted-foreground mt-4 pt-3 border-t">
            {t("gymBooking.notMember")} {company?.name ? t("gymBooking.notMemberGym") : t("gymBooking.notMemberUs")} {t("gymBooking.toSignUp")}
          </p>     
          {company?.email && (
            <div className="flex justify-center gap-4 pt-3 border-t mt-3">
              {company.email && (
                <a 
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">{company.email}</span>
                </a>
              )}
              {company.phone && (
                <a 
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">{company.phone}</span>
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}