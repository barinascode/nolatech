
"use client";

import { useSession } from "@/hooks/useSession";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function RoleDisplay() {
  const { employee } = useSession();
  const role = employee?.role || "Unknown Role";

  return (
    <div className="mb-6 p-4 border border-dashed rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-muted-foreground">Your current role:</span>
        <Badge variant="outline">{role}</Badge>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          Dashboard content will be tailored based on user roles in future updates.
        </span>
      </div>
    </div>
  );
}
