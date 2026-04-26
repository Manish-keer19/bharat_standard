import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/auth/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.login({ email, password });

      if (res.success) {
        localStorage.setItem("admin_token", res.data.token);
        toast.success("Login successful!");
        navigate({ to: "/admin" });
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary rounded-none card-news">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-1 bg-primary mb-4" />
          <CardTitle className="text-3xl font-serif font-bold text-ink">Login</CardTitle>
          <CardDescription className="text-ink-muted">
            Secure access to Bharat Standard management.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-ink-muted">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bharatstandard.com"
                  className="pl-10 rounded-none border-rule focus:border-primary transition-colors h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-ink-muted">Security Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 rounded-none border-rule focus:border-primary transition-colors h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-8">
            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-none" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
