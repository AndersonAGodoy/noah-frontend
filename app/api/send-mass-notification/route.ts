import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";

// Inicializar Firebase Admin
if (!admin.apps.length) {
  // Tentar usar Service Account Key completo primeiro, depois fallback para env vars individuais
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      // Tentar decodificar se estiver em base64
      let serviceAccount;
      if (serviceAccountKey.startsWith("{")) {
        // Já é JSON
        serviceAccount = JSON.parse(serviceAccountKey);
      } else {
        // Está em base64, decodificar primeiro
        const decoded = Buffer.from(serviceAccountKey, "base64").toString(
          "utf-8",
        );
        serviceAccount = JSON.parse(decoded);
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      // console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format");
    }
  } else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    // Fallback para variáveis individuais
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // console.warn(
      "⚠️ Firebase Admin credentials not configured - notifications disabled",
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se Firebase Admin está configurado
    if (!admin.apps.length) {
      // console.warn("⚠️ Firebase Admin not initialized - skipping notification");
      return NextResponse.json({
        success: true,
        message: "Notifications disabled (credentials not configured)",
        successCount: 0,
        failureCount: 0,
      });
    }

    // Verificar autenticação via session cookie ou Authorization header
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const authHeader = request.headers.get("authorization");

    let decodedClaims;

    // Tentar autenticar com session cookie
    if (sessionCookie) {
      try {
        decodedClaims = await admin
          .auth()
          .verifySessionCookie(sessionCookie, true);
      } catch (error) {
        // console.error("Session cookie verification failed:", error);
      }
    }

    // Se não tiver session cookie, tentar Authorization header
    if (!decodedClaims && authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.replace("Bearer ", "");
      try {
        decodedClaims = await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        // console.error("ID token verification failed:", error);
      }
    }

    // Se não conseguiu autenticar de nenhuma forma
    if (!decodedClaims) {
      return NextResponse.json(
        { success: false, error: "No valid authentication" },
        { status: 401 },
      );
    }

    // Verificar se o usuário é admin
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - admin only" },
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
    // console.error("Error sending mass notification:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
