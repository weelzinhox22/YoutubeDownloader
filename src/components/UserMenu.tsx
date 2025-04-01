
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/auth")}
        className="flex items-center gap-2"
      >
        <User size={16} />
        <span>Entrar</span>
      </Button>
    );
  }

  const userEmail = user.email || "Usuário";
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <User size={16} />
          <span className="max-w-28 truncate">{userEmail}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-muted-foreground">
          {userEmail}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive flex items-center gap-2">
          <LogOut size={16} />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
