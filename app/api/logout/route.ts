// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Deleta o cookie
  const res = NextResponse.json({ message: "Logout realizado com sucesso" });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // expira imediatamente
  });

  return NextResponse.json({ message: "Logout realizado com sucesso" });
}
