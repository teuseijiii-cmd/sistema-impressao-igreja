
ARQUIVO: 21. frontend/src/utils/auth.ts<br/>
CAMINHO: frontend/src/utils/auth.ts<br/>
DESCRIÇÃO: Utilitários de autenticação

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;<br/>
  email: string;<br/>
  name: string;<br/>
  role: 'admin' | 'leader' | 'operator';<br/>
  avatar_url?: string;<br/>
  created_at: string;
}

// Função para login com Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',<br/>
    options: {<br/>
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

// Função para logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem('auth_token');
  return { error };
}

// Função para obter sessão atual
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// Função para obter perfil do usuário
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erro ao carregar perfil:', error);
    return null;
  }
  return data;
}

// Função para atualizar perfil
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
}

// Função para verificar permissões
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = ['operator', 'leader', 'admin'];
  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

// Função para tratar callback de autenticação
export async function handleAuthCallback() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro no callback de autenticação:', error);
    return null;
  }
  return data.session;
}
