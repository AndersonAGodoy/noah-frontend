import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";

// Inicializar Firebase Admin
if (!admin.apps.length) {
  // Tentar usar Service Account Key completo primeiro, depois fallback para env vars individuais
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
    }
  } else {
    // Fallback para variáveis individuais
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 VERIFICAÇÃO DE AUTENTICAÇÃO
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - No session" },
        { status: 401 },
      );
    }

    // Verificar se o usuário está autenticado
    let decodedClaims;
    try {
      decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Invalid session" },
        { status: 401 },
      );
    }

    // Verificar se é admin (adicione este campo customizado no Firebase Auth)
    if (!decodedClaims.admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { title, body, url, imageUrl } = await request.json();

    // Buscar todos os tokens válidos do Firestore
    const tokensSnapshot = await admin
      .firestore()
      .collection("fcmTokens")
      .where("isValid", "==", true)
      .get();

    const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No tokens to send notifications to",
        sent: 0,
      });
    }

    // Criar mensagem
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
        imageUrl,
      },
      data: {
        url: url || "/",
      },
      tokens,
    };

    // Enviar para todos os tokens
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(`Sent ${response.successCount} notifications`);
    console.log(`Failed ${response.failureCount} notifications`);

    // Marcar tokens inválidos
    if (response.failureCount > 0) {
      const invalidTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          invalidTokens.push(tokens[idx]);
        }
      });

      // Atualizar tokens inválidos no Firestore
      const batch = admin.firestore().batch();

      for (const token of invalidTokens) {
        const tokenDocs = await admin
          .firestore()
          .collection("fcmTokens")
          .where("token", "==", token)
          .get();

        tokenDocs.forEach((doc) => {
          batch.update(doc.ref, { isValid: false });
        });
      }

      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error: any) {
    console.error("Error sending mass notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
