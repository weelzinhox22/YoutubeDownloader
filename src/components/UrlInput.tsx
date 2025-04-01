
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState("");
  const isValidUrl = url.includes("youtube.com/") || url.includes("youtu.be/");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidUrl && !isLoading) {
      onSubmit(url);
    }
  };
  
  const clearInput = () => {
    setUrl("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={cn(
            "pr-16 transition-all",
            isValidUrl && "border-primary",
            "focus-visible:ring-primary"
          )}
        />
        {url && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={!isValidUrl || isLoading}
        >
          <Search size={18} className={isValidUrl ? "text-primary" : "text-muted-foreground"} />
        </Button>
      </div>
    </form>
  );
};

export default UrlInput;
