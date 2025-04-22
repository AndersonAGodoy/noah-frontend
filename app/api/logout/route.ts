// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Deleta o cookie
  const cookieStore = cookies();
  (await cookieStore).delete("token");

  return NextResponse.json(
    { message: "Logout realizado com sucesso" },
    {
      headers: {
        "Set-Cookie": `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      },
    }
  );
}
