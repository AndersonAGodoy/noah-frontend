// app/api/login/route.ts ou pages/api/login.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 mantêm os cookies
      body: JSON.stringify({ email, password }),
    }
  );

  if (response.ok) {
    return NextResponse.json({ message: "Login successful" });
  } else {
    return NextResponse.json({ message: "Login failed" }, { status: 401 });
  }
}
