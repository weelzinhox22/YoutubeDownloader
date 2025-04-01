
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AtSign, Eye, EyeOff, Lock } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        // Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;
        
        toast.success("Cadastro realizado com sucesso!", {
          description: "Verifique seu e-mail para confirmar o cadastro."
        });
      }
    } catch (error: any) {
      console.error("Erro de autenticação:", error);
      toast.error(error.message || "Ocorreu um erro durante a autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-main text-transparent bg-clip-text mb-2">
            Media Flare
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Entre para baixar seus vídeos" : "Crie sua conta para começar"}
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <button 
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? "Processando..." 
                : isLogin ? "Entrar" : "Criar conta"
              }
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button 
              type="button" 
              className="text-primary hover:underline" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin 
                ? "Não tem uma conta? Cadastre-se" 
                : "Já tem uma conta? Entre"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
