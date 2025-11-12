# Troubleshooting - Dashboard não carrega informações

## Problema

O dashboard não está conseguindo buscar as informações do Firebase em ambiente de desenvolvimento.

## Diagnóstico implementado

Adicionamos logs extensivos para rastrear o problema:

### 1. Logs no Service (`sermonsService.ts`)

- ✅ Log ao iniciar query
- ✅ Log da instância do Firebase DB
- ✅ Log do total de sermões encontrados
- ✅ Log dos documentos retornados
- ✅ Log de erros detalhados

### 2. Logs no Hook (`useGetSermonsFirebase.ts`)

- ✅ Log ao iniciar fetch
- ✅ Log de sucesso com resultado
- ✅ Log de erro

### 3. Logs no Componente (`DashboardPage.tsx`)

- ✅ Log do estado completo (loading, error, data)
- ✅ Log do tipo de dados recebidos

## Possíveis causas

### 1. **Variáveis de ambiente não configuradas**

**Verificação:**

```bash
# Verifique se o arquivo .env.local existe
ls .env.local

# Se não existir, copie do exemplo:
cp .env.example .env.local
```

**Solução:**

- Copie `.env.example` para `.env.local`
- Preencha com as credenciais reais do Firebase Console
- Reinicie o servidor de desenvolvimento

### 2. **Firebase não inicializado corretamente**

**Verificação:**

- Abra o console do navegador
- Procure por: `✅ Firebase initialized` ou `♻️ Firebase already initialized`

**Solução:**
Se não aparecer, verifique:

- Se as variáveis de ambiente estão corretas
- Se o Firebase está configurado corretamente no projeto

### 3. **Regras de segurança do Firestore**

**Verificação:**
No Firebase Console > Firestore Database > Rules

**Solução:**
Para desenvolvimento, você pode usar (TEMPORARIAMENTE):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ APENAS PARA DESENVOLVIMENTO
    }
  }
}
```

⚠️ **ATENÇÃO:** Essas regras permitem acesso público! Use apenas em desenvolvimento.

Para produção, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sermons/{sermonId} {
      allow read: if resource.data.isPublished == true;
      allow write: if request.auth != null;
    }
    match /participants/{participantId} {
      allow read, write: if request.auth != null;
    }
    match /encounters/{encounterId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. **Índices faltando no Firestore**

**Verificação:**

- Abra o console do navegador
- Procure por erros mencionando "index"

**Solução:**
Se aparecer um link no erro, clique nele para criar o índice automaticamente.

Ou crie manualmente:

- Firebase Console > Firestore Database > Indexes
- Adicione índices para:
  - Collection: `sermons`, Fields: `date` (Descending)
  - Collection: `sermons`, Fields: `isPublished` (Ascending), `createdAt` (Descending)

### 5. **Problemas de rede/CORS**

**Verificação:**

- Abra Network tab no DevTools
- Procure por requisições falhando

**Solução:**

- Verifique sua conexão com a internet
- Verifique se o domínio está autorizado no Firebase Console

### 6. **Cache corrompido**

**Solução:**

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules e reinstalar
rm -rf node_modules
npm install

# Reiniciar servidor
npm run dev
```

## Como verificar

1. **Abra o console do navegador** (F12)
2. **Acesse o dashboard** (`/dashboard`)
3. **Procure pelos logs**:

   - `🎣 [useGetSermonsFirebase] Fetching sermons...`
   - `🔍 [getSermons] Starting query...`
   - `📊 [DashboardPage] State:...`

4. **Identifique onde o processo falha**:
   - Se não aparecer o log do hook → problema no componente
   - Se não aparecer o log do service → problema no hook
   - Se aparecer erro específico → siga a mensagem de erro

## Comandos úteis para debug

```bash
# Ver variáveis de ambiente (não mostra valores por segurança)
npm run dev -- --show-all

# Limpar tudo e começar do zero
rm -rf .next node_modules
npm install
npm run dev

# Verificar se o Firebase está configurado
node -e "console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)"
```

## Checklist rápido

- [ ] Arquivo `.env.local` existe e está preenchido
- [ ] Variáveis começam com `NEXT_PUBLIC_`
- [ ] Firebase Console está acessível
- [ ] Regras de segurança permitem leitura
- [ ] Índices necessários estão criados
- [ ] Servidor foi reiniciado após mudanças no `.env.local`
- [ ] Console do navegador não mostra erros de CORS
- [ ] Coleção `sermons` existe no Firestore

## Contato

Se o problema persistir após seguir todos os passos, compartilhe:

1. Screenshot do console do navegador
2. Screenshot das regras do Firestore
3. Mensagem de erro completa
