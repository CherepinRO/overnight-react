import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Zap } from "lucide-react";

export default function Hero({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium" data-testid="badge-new-feature">
              <Zap className="w-4 h-4" />
              <span>Earn while you sleep</span>
            </div>
            
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight text-foreground" data-testid="text-hero-title">
              Turn Your Idle Money Into{" "}
              <span className="text-primary">Overnight Income</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-subtitle">
              Automatically invest your spare cash in overnight funds and wake up to earnings. Safe, simple, and powered by trusted banking partners.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-base px-8"
                onClick={onGetStarted}
                data-testid="button-hero-start"
              >
                Start Earning Tonight
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8"
                data-testid="button-hero-learn"
              >
                See How It Works
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-chart-3" />
                <span className="text-sm text-muted-foreground">Bank-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-chart-3" />
                <span className="text-sm text-muted-foreground">FDIC insured</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 backdrop-blur-sm border border-border/50 shadow-2xl" data-testid="card-hero-dashboard">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-foreground">Your Earnings</h3>
                  <div className="px-3 py-1 rounded-full bg-chart-3/10 text-chart-3 text-sm font-semibold">+12.3%</div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Earned This Month</p>
                  <p className="font-mono text-4xl font-bold text-foreground">$1,247.82</p>
                </div>
                
                <div className="h-32 bg-gradient-to-r from-chart-1/20 to-chart-4/20 rounded-lg flex items-end gap-1 p-4">
                  {[40, 65, 45, 80, 60, 90, 75, 95].map((height, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary rounded-sm transition-all hover:bg-primary/80"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Daily Avg</p>
                    <p className="font-mono text-lg font-semibold text-foreground">$41.59</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Best Day</p>
                    <p className="font-mono text-lg font-semibold text-foreground">$87.20</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">APY</p>
                    <p className="font-mono text-lg font-semibold text-chart-3">4.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
