import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Inicializar Firebase Admin
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      let serviceAccount;
      if (serviceAccountKey.startsWith("{")) {
        serviceAccount = JSON.parse(serviceAccountKey);
      } else {
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
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Buscar TODOS os tokens (incluindo os marcados como inválidos)
    const tokensSnapshot = await admin
      .firestore()
      .collection("fcmTokens")
      .get();

    const batch = admin.firestore().batch();
    let count = 0;

    tokensSnapshot.forEach((doc) => {
      batch.update(doc.ref, { isValid: true });
      count++;
    });

    await batch.commit();

    // console.log(`✅ Reset ${count} FCM tokens to valid`);

    return NextResponse.json({
      success: true,
      message: `Reset ${count} tokens to valid`,
      count,
    });
  } catch (error: any) {
    // console.error("Error resetting FCM tokens:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
