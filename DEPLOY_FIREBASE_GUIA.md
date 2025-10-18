# 🚀 Guia de Deploy - Firebase Firestore

## 📋 Antes de Fazer Deploy

### 1. Verificar Todos os Componentes Migrados

```bash
# Procure por referências aos hooks antigos
grep -r "useCreateParticipant()" app/ components/
grep -r "useGetParticipants()" app/ components/
grep -r "useCreateSermon()" app/ components/
grep -r "useUpdateSermon()" app/ components/
grep -r "useDeleteSermon()" app/ components/
```

Se encontrar algo, atualize para os novos hooks Firebase.

### 2. Verificar Variáveis de Ambiente

```bash
# Verifique se .env.local tem todas as variáveis
cat .env.local

# Deve conter:
# NEXT_PUBLIC_FIREBASE_API_KEY
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# NEXT_PUBLIC_FIREBASE_PROJECT_ID
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# NEXT_PUBLIC_FIREBASE_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### 3. Testar Localmente

```bash
# Limpe cache e instale dependências
rm -r .next node_modules
yarn install

# Execute testes
yarn build

# Inicie servidor local
yarn dev
```

### 4. Testar Funcionalidades

- [ ] Criar novo participante
- [ ] Ver lista de participantes
- [ ] Criar novo sermão
- [ ] Atualizar sermão
- [ ] Publicar sermão
- [ ] Verificar dados no Firestore Console

## 🔧 Configurar Firestore para Produção

### 1. Security Rules

No Firebase Console → Firestore Database → Rules, adicione:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de sermões publicados
    match /sermons/{document=**} {
      allow read: if resource.data.isPublished == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Permitir CRUD de participantes apenas para autenticados
    match /participants/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Índices (Se Necessário)

Se receber erro de índice faltante:

1. Vá para Firebase Console → Firestore → Índices
2. Crie índices conforme solicitado automaticamente

### 3. Backups Automáticos

1. Firebase Console → Firestore → Backups
2. Configure backup automático diário

## 🌍 Deploy no Vercel

### 1. Preparar Repository

```bash
# Atualize repositório
git add .
git commit -m "Migração para Firebase Firestore completa"
git push origin main
```

### 2. Variáveis de Ambiente no Vercel

1. Vá para [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá para Settings → Environment Variables
4. Adicione todas as variáveis do Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY = valor
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = valor
NEXT_PUBLIC_FIREBASE_PROJECT_ID = valor
# ... resto das variáveis
```

### 3. Deploy

```bash
# O Vercel fará deploy automaticamente ao fazer push
# Ou você pode fazer deploy manual no dashboard
```

## 🐛 Monitorar Após Deploy

### 1. Verificar Logs

```
Vercel Dashboard → Projeto → Deployments → Logs
```

### 2. Testar em Produção

1. Acesse seu site em produção
2. Teste criar participante
3. Teste criar sermão
4. Verifique Firestore Console

### 3. Monitorar Firestore

```
Firebase Console → Firestore → Monitoring
- Verifique queries e usage
- Configure alertas de quota
```

## 📊 Performance

### Cache Optimization

```typescript
// Já configurado nos hooks com:
staleTime: 30 * 1000,    // 30 segundos
gcTime: 5 * 60 * 1000,   // 5 minutos
```

### Database Indexes

Firestore criará automaticamente indexes conforme necessário.

## 🔐 Segurança em Produção

### 1. Validação Backend

- ✅ Zod valida no frontend
- ✅ Firebase Rules validam no backend
- ✅ Dados sanitizados automaticamente

### 2. Autenticação

- ✅ Email/Senha com Firebase Auth
- ✅ Tokens JWT gerenciados automaticamente
- ✅ HTTPS obrigatório

### 3. CORS

- ✅ Firebase gerencia automaticamente
- ✅ Sem configuração necessária

## 🔄 Rollback (Se Necessário)

### Voltar para Postgres

1. Mantenha os hooks antigos em branch separado
2. Git checkout para versão anterior se necessário
3. Considere manter dados sincronizados por 1-2 semanas

### Voltar Deploy Vercel

1. Vercel Dashboard → Deployments
2. Clique em "Redeploy" de versão anterior

## 📞 Monitoramento Contínuo

### Configurar Alertas

1. Firebase Console → Project Settings → Quotas
2. Definir limites de uso
3. Receber notificações quando próximo ao limite

### Analytics

```typescript
// Opcional: Rastrear eventos
import { logEvent } from "@firebase/analytics";
import { analytics } from "@/lib/firebase/config";

logEvent(analytics, "participant_created", {
  encounterId: "id",
});
```

## ✅ Checklist Final

- [ ] Todos os componentes migrados
- [ ] Variáveis de ambiente configuradas
- [ ] Build local bem-sucedido
- [ ] Testes locais passando
- [ ] Security Rules configuradas
- [ ] Variáveis no Vercel configuradas
- [ ] Deploy bem-sucedido
- [ ] Funcionalidades testadas em produção
- [ ] Dados aparecem no Firestore
- [ ] Alertas de monitoramento configurados

## 🎉 Parabéns!

Sua aplicação está 100% migrada para Firebase Firestore e pronta para produção!

**Próximas melhorias:**

- Implementar listeners real-time
- Adicionar upload de arquivos
- Criar relatórios avançados
- Implementar push notifications
