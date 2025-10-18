// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Temporariamente desabilitado para Firebase Auth
  // O Firebase Auth gerencia a autenticação no lado do cliente
  // e pode não ter cookies disponíveis imediatamente no servidor

  // Para uma verificação mais robusta, você pode:
  // 1. Usar Firebase Admin SDK no middleware
  // 2. Ou fazer a verificação no lado do cliente

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
