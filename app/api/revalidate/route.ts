// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, sermonId } = body;

    console.log("🔄 Manual revalidation triggered:", { type, sermonId });

    if (type === "sermon-published") {
      // Revalidar a homepage
      revalidatePath("/");
      console.log("✅ Homepage revalidated");

      // Se temos um ID específico do sermão, revalidar também a página individual
      if (sermonId) {
        revalidatePath(`/sermons/sermon/${sermonId}`);
        console.log(`✅ Sermon page revalidated: /sermons/sermon/${sermonId}`);
      }

      // Revalidar todas as páginas de sermões (opcional)
      revalidatePath("/sermons/sermon/[id]", "page");
      console.log("✅ All sermon pages revalidated");

      return NextResponse.json({
        message: "Revalidation successful",
        paths: ["/", `/sermons/sermon/${sermonId}`],
      });
    }

    if (type === "sermon-unpublished") {
      // Quando um sermão é despublicado, também revalidar
      revalidatePath("/");
      console.log("✅ Homepage revalidated (sermon unpublished)");

      return NextResponse.json({
        message: "Revalidation successful (unpublished)",
        paths: ["/"],
      });
    }

    return NextResponse.json(
      {
        error: "Invalid revalidation type",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Revalidation error:", error);
    return NextResponse.json(
      {
        error: "Revalidation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
