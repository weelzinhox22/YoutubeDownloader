
import React from "react";
import NavigationBar from "@/components/NavigationBar";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Moon,
  Sun,
  Monitor,
  Info,
  ExternalLink,
  Github,
  Heart
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
    },
  ];
  
  const handleShareApp = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Media Flare",
          text: "Check out this YouTube downloader app! It's amazing!",
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success("App URL copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-24 gap-2"
                      onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                    >
                      <Icon size={24} />
                      <span>{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Information about Media Flare
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span>Version</span>
                </div>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between">
                    <span>Terms of Service</span>
                    <ExternalLink size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Terms of Service</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        This application is provided for demonstration purposes only. Users are responsible for compliance with YouTube's Terms of Service.
                      </p>
                      <p>
                        Media Flare does not store or host any content from YouTube. All downloads are processed on the user's device.
                      </p>
                      <p>
                        Copyright © 2023 Media Flare. All rights reserved.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Close</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleShareApp}
              >
                Share App
              </Button>
              <div className="w-full text-center">
                <span className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  Built with <Heart size={14} className="text-red-500" /> by Media Flare Team
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default Settings;
