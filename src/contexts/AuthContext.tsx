import React, { useState, useEffect } from 'react';

export function AuthProvider({ children }: AuthProviderProps) {
  // Remover estado de usuário e substituir por um usuário "anônimo" padrão
  const [user, setUser] = useState<User | null>({
    id: 'anonymous',
    email: 'anonymous@user.com',
    // outros campos necessários
  });
  
  // Remover verificação de sessão no useEffect
  useEffect(() => {
    // Não precisamos mais verificar a sessão do Supabase
    // Apenas definir o usuário anônimo diretamente
    setUser({
      id: 'anonymous',
      email: 'anonymous@user.com',
      // outros campos necessários
    });
  }, []);

  // Simplificar ou remover funções de autenticação
  async function signIn() {
    // Não é mais necessário
    return true;
  }

  async function signOut() {
    // Não é mais necessário
    return true;
  }

  // ... existing code ...
} 