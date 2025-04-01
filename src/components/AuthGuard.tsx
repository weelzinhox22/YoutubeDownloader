
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({ 
  requireAuth = true, 
  redirectTo = requireAuth ? '/auth' : '/' 
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Se não está carregando mais, não precisamos mais verificar
      setIsChecking(false);
    }
  }, [isLoading]);

  // Mostra um loader enquanto verifica a autenticação
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Se requer autenticação e o usuário não está autenticado, redireciona
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se não requer autenticação e o usuário está autenticado, redireciona
  if (!requireAuth && user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Caso contrário, renderiza os componentes filhos
  return <Outlet />;
};

export default AuthGuard;
