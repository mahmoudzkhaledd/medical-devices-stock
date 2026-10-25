import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-xl border p-5 shadow-sm">
      <div>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <h3 className="mt-1 text-2xl font-bold">{value}</h3>
      </div>
      <div className="bg-primary/10 text-primary rounded-lg p-3">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
