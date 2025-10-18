# SSG (Static Site Generation) - Configuração para Next.js 15 App Router

## 📋 Resumo

Implementamos SSG com ISR (Incremental Static Regeneration) usando **App Router do Next.js 15** para reduzir drasticamente os custos do Firebase. O site agora gera páginas estáticas durante o build que são atualizadas automaticamente a cada semana.

## 🔧 Como funciona

### 1. Páginas Estáticas

- **Homepage (`/`)**: Lista de sermões publicados (Server Component)
- **Páginas de Sermões (`/sermons/sermon/[id]`)**: Conteúdo individual de cada sermão (generateStaticParams)

### 2. Arquitetura App Router

- **Server Components**: Fazem fetch dos dados durante o build
- **Client Components**: Componentes interativos que rodam no navegador
- **ISR**: Revalidação automática a cada 7 dias

### 3. Cache e Revalidação

- **Cache Duration**: 7 dias (604800 segundos)
- **Revalidação**: ISR regenera as páginas automaticamente quando necessário
- **dynamicParams**: Páginas não geradas no build são criadas sob demanda

### 4. Redução de Custos Firebase

- **Build Time**: Firebase é acessado apenas durante o build
- **Runtime**: Usuários acessam páginas pré-geradas (sem queries ao Firebase)
- **Economia**: ~99% menos queries ao Firebase para usuários finais

## 🚀 Como Usar

### Desenvolvimento

```bash
# Servidor de desenvolvimento (ainda usa queries dinâmicas no dashboard)
yarn dev
```

### Produção (SSG)

```bash
# Build com páginas estáticas
yarn build

# Iniciar servidor de produção
yarn start
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env.local)

```bash
# Configurações básicas do Firebase (obrigatórias)
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Para produção (opcional - melhora performance)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

### 🔧 Configuração de Credenciais

#### Opção 1: Usar apenas Client SDK (Recomendado para início)

O SSG agora usa **automaticamente** o Firebase Client SDK como fallback quando as credenciais Admin não estão disponíveis. Isso significa que você pode usar SSG **imediatamente** sem configurar Service Account!

**✅ Vantagens:**

- Funciona imediatamente
- Não precisa configurar credenciais Admin
- Ainda tem cache SSG (economia de 95%+ nas queries)

**⚠️ Limitações:**

- Algumas queries avançadas podem ser mais lentas
- Precisará das regras de segurança do Firestore liberadas para leitura

#### Opção 2: Firebase Admin SDK (Máxima Performance)

Para máxima performance, configure o Service Account:

**1. No Firebase Console:**

- Vá em **Project Settings > Service Accounts**
- Clique em **Generate new private key**
- Baixe o arquivo JSON

**2. Configure a variável de ambiente:**

```bash
# Copie todo o conteúdo do arquivo JSON em uma linha
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"seu-projeto",...}
```

**✅ Vantagens:**

- Máxima performance
- Queries mais eficientes
- Sem limitações de segurança

### 🔄 Como funciona o Fallback

```typescript
// O sistema tenta Admin SDK primeiro
if (FIREBASE_SERVICE_ACCOUNT_KEY existe) {
  usar Firebase Admin SDK ✅
} else {
  usar Firebase Client SDK ✅
}
```

**Resultado:** SSG funciona em **qualquer** situação!

## 📁 Estrutura de Arquivos (App Router)

```
app/
├── page.tsx                     # Homepage (Server Component)
├── ClientHomePage.tsx           # Componente cliente da homepage
├── sermons/
│   └── sermon/
│       └── [id]/
│           ├── page.tsx         # Página de sermão (Server Component)
│           └── ClientSermonPage.tsx  # Componente cliente do sermão
lib/
├── firebase/
│   └── ssg-services.ts          # Serviços Firebase para SSG
└── utils/
    ├── formatDate.ts            # Utilities para formatação
    └── badgeColor.ts            # Colors para badges
```

## 🔄 ISR no App Router (Next.js 15)

### Server Components

```typescript
// app/page.tsx
export const revalidate = 604800; // 7 dias
export const dynamic = "force-static";

export default async function HomePage() {
  const sermons = await getPublishedSermonsSSG();
  return <ClientHomePage sermons={sermons} />;
}
```

### generateStaticParams

```typescript
// app/sermons/sermon/[id]/page.tsx
export async function generateStaticParams() {
  const sermonIds = await getAllSermonIdsSSG();
  return sermonIds.map((id) => ({ id }));
}

export const dynamicParams = true; // Fallback para novos sermões
```

### Benefícios

- **Performance**: Páginas instantâneas
- **SEO**: Conteúdo sempre indexável
- **Economia**: Mínimo uso do Firebase
- **Escalabilidade**: Suporta milhares de usuários simultâneos

## 📊 Impacto nos Custos

### Antes (App Router + React Query)

- **Cada usuário**: 1 query para listar sermões + 1 query por sermão visualizado
- **100 usuários/dia**: ~200-500 queries/dia
- **Mensal**: ~6.000-15.000 queries

### Depois (SSG + ISR)

- **Build semanal**: ~10-50 queries (apenas durante build)
- **Usuários**: 0 queries (páginas estáticas)
- **Mensal**: ~40-200 queries total

### Economia: ~95-99% menos queries Firebase! 🎉

## 🔧 Configurações de Cache

### next.config.mjs

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};
```

## 🚨 Importante

1. **Dashboard Admin**: Continue usando App Router (`/dashboard`) com queries dinâmicas
2. **Páginas Públicas**: Agora usam SSG com Server Components
3. **Development**: `yarn dev` usa dados dinâmicos para desenvolvimento
4. **Production**: `yarn build && yarn start` usa páginas estáticas

## 📈 Próximos Passos

1. ✅ Implementar SSG com App Router
2. ✅ Configurar ISR automático
3. ✅ Otimizar cache headers
4. 🔄 Testar em produção
5. 📊 Monitorar redução de custos

## 🛠️ Resolução do Conflito

**Problema resolvido**: Removemos o Pages Router que estava causando conflito e implementamos tudo usando apenas **App Router do Next.js 15**, que é a abordagem moderna e recomendada.
