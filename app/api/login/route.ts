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
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return res;
  } else {
    return NextResponse.json({ message: "Login failed" }, { status: 401 });
  }
}
