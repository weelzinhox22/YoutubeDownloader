
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  children,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 animate-fade-in",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">{description}</p>
      {children}
    </div>
  );
};

export default EmptyState;
