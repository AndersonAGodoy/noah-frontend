// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NOTA IMPORTANTE: Este middleware está DESABILITADO intencionalmente
 * 
 * Razão: Firebase Auth gerencia autenticação no lado do cliente.
 * O token de autenticação fica no localStorage/sessionStorage do navegador,
 * não em cookies acessíveis pelo servidor Next.js.
 * 
 * A verificação de autenticação acontece em:
 * - app/dashboard/layout.tsx (useEffect + onAuthStateChanged)
 * - Redirecionamento para /login se não autenticado
 * 
 * Para implementar autenticação no servidor (opcional), seria necessário:
 * 1. Criar API route que gera session cookie após login
 * 2. Usar Firebase Admin SDK neste middleware
 * 3. Verificar o session cookie aqui
 * 
 * Documentação: https://firebase.google.com/docs/auth/admin/manage-cookies
 */

export function middleware(req: NextRequest) {
  // Middleware passthrough - autenticação acontece no cliente
  return NextResponse.next();
}

export const config = {
  // Matcher vazio significa que o middleware não intercepta nenhuma rota
  matcher: [],
};
