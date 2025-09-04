// components/ui/loading.tsx
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
    </div>
  );
}
