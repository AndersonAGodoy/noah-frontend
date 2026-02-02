// Script para configurar admin claims no Firebase
// Execute com: node set-admin.js

const admin = require("firebase-admin");

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}",
);

if (!serviceAccount.project_id) {
  console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY não encontrada no .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// SUBSTITUA ESTE UID PELO SEU (copie do Firebase Console → Authentication)
const userUID = "77x1Q1K2Q8NEtIY9O9hAOJixphi1";

async function setAdminClaim() {
  try {
    // Definir custom claim admin: true
    await admin.auth().setCustomUserClaims(userUID, { admin: true });

    console.log("✅ Admin claim configurado com sucesso!");
    console.log(`👤 Usuário ${userUID} agora é ADMIN`);

    // Verificar se foi aplicado
    const user = await admin.auth().getUser(userUID);
    console.log("🔍 Custom claims:", user.customClaims);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao configurar admin claim:", error);
    process.exit(1);
  }
}

setAdminClaim();
