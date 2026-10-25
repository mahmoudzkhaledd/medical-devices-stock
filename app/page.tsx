import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="from-background to-muted/40 flex min-h-screen items-center justify-center bg-gradient-to-b p-4 sm:p-6 md:p-8">
      <Card className="max-full border-border/60 bg-card/95 w-full max-w-lg shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200 hover:scale-105">
            <Activity className="h-7 w-7" />
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Badge
              variant="outline"
              className="gap-1.5 px-2.5 py-0.5 text-xs font-normal"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Enterprise Platform.
            </Badge>
          </div>
          <CardTitle className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Medical Devices Management System
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm leading-relaxed sm:px-4">
            Welcome to the centralized asset management portal. Monitor
            equipment lifecycles, manage maintenance workflows, and ensure
            compliance seamlessly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="text-muted-foreground grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-muted/50 border-border/40 flex items-center gap-2 rounded-lg border p-2.5">
              <ShieldCheck className="text-primary h-4 w-4 shrink-0" />
              <span>Compliant & Secure</span>
            </div>
            <div className="bg-muted/50 border-border/40 flex items-center gap-2 rounded-lg border p-2.5">
              <Stethoscope className="text-primary h-4 w-4 shrink-0" />
              <span>Real-time Tracking</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            size="lg"
            className="w-full font-medium shadow-md transition-all hover:shadow-lg"
          >
            <Link
              href="/auth"
              className="flex items-center justify-center gap-2"
            >
              Log In to Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Authorized hospital personnel and engineering staff only.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
