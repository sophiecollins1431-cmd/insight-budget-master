import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, MapPin, TrendingUp, Users } from "lucide-react";

export const AuthPrompt = () => {
  return (
    <Card className="p-8 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 animate-bounce-in">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Unlock Full Features</h2>
        <p className="text-muted-foreground">
          Connect to Supabase to enable authentication, data persistence, and advanced features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Secure Authentication</h3>
            <p className="text-xs text-muted-foreground">Email/password login system</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <Database className="h-5 w-5 text-accent" />
          <div>
            <h3 className="font-semibold text-sm">Data Persistence</h3>
            <p className="text-xs text-muted-foreground">Your expenses saved forever</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <MapPin className="h-5 w-5 text-success" />
          <div>
            <h3 className="font-semibold text-sm">Location Tracking</h3>
            <p className="text-xs text-muted-foreground">Map of where you spend</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-warning" />
          <div>
            <h3 className="font-semibold text-sm">Advanced Analytics</h3>
            <p className="text-xs text-muted-foreground">Detailed spending insights</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Click the <strong className="text-primary">green Supabase button</strong> in the top-right corner to get started
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>Multi-user support • Row-level security • Real-time sync</span>
        </div>
      </div>
    </Card>
  );
};