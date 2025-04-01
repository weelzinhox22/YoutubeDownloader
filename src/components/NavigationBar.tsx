
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationBar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: History, path: "/history", label: "History" },
    { icon: Settings, path: "/settings", label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-border px-2 py-2 flex justify-around items-center animate-slide-up">
      {navItems.map(({ icon: Icon, path, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
              isActive 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon 
              size={24} 
              className={cn(
                "transition-all", 
                isActive ? "animate-pulse-gentle" : ""
              )} 
            />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
