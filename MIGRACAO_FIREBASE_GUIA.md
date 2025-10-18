# 🚀 Migração do Postgres para Firebase Firestore - Guia Completo

## 📋 Resumo da Migração

Você migrou com sucesso de uma arquitetura REST/PostgreSQL para **Firebase Firestore**, uma base de dados NoSQL em tempo real hospedada no Google Cloud.

## 🔧 O Que Foi Alterado

### 1. **Instalação e Configuração**

- ✅ Firebase SDK instalado
- ✅ Firestore, Authentication e Storage configurados
- ✅ Variáveis de ambiente criadas (`.env.firebase.example`)

### 2. **Estrutura de Pastas**

```
lib/firebase/
├── config.ts                          # Configuração do Firebase
└── services/
    ├── authService.ts                 # Autenticação
    ├── participantsService.ts         # CRUD de Participantes
    └── sermonsService.ts              # CRUD de Sermões
```

### 3. **Hooks Atualizados**

```
lib/hooks/
├── useCreateParticipantFirebase.ts    # Criar participante
├── useGetParticipantsFirebase.ts      # Buscar participantes
├── useCreateSermonFirebase.ts         # Criar sermão
├── useGetSermonsFirebase.ts           # Buscar sermões
├── useUpdateSermonFirebase.ts         # Atualizar sermão
└── useDeleteSermonFirebase.ts         # Deletar/Publicar sermão
```

## 🔐 Configuração do Firebase

### 1. **Obter Credenciais**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou use um existente
3. Vá em **Configurações do Projeto** → **Suas Apps**
4. Clique em **Config** e copie as credenciais

### 2. **Configurar `.env.local`**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcd...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. **Habilitar Serviços no Firebase**

1. **Authentication**: Habilitar Email/Senha
2. **Firestore Database**: Criar em modo desenvolvimento
3. **Storage**: Para armazenar uploads (opcional)

## 📊 Estrutura do Firestore

### Collection: `participants`

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phoneNumber": "+5511999999999",
  "age": 30,
  "address": "São Paulo, SP",
  "observations": "Primeira vez no encontro",
  "typeOfParticipation": "firstTime",
  "encounterId": "encontro-123",
  "createdAt": "2025-10-17T10:30:00Z",
  "updatedAt": "2025-10-17T10:30:00Z"
}
```

### Collection: `sermons`

```json
{
  "title": "Título do Sermão",
  "description": "Descrição breve",
  "speaker": "Pastor Bruno",
  "duration": "45:30",
  "date": "2025-12-25",
  "time": "19:00",
  "eventType": "Culto",
  "isPublished": false,
  "references": [
    {
      "reference": "João 3:16",
      "text": "Porque Deus amou o mundo..."
    }
  ],
  "contentSections": [
    {
      "type": "parágrafo",
      "content": "Conteúdo do parágrafo..."
    }
  ],
  "createdAt": "2025-10-17T10:30:00Z",
  "updatedAt": "2025-10-17T10:30:00Z",
  "publishedAt": null
}
```

## 🔄 Como Usar os Hooks

### **Criar Participante**

```typescript
import useCreateParticipantFirebase from "@/lib/hooks/useCreateParticipantFirebase";

const { mutateAsync: createParticipant } = useCreateParticipantFirebase();

const handleSubmit = async (values) => {
  try {
    await createParticipant({
      ...values,
      encounterId: "encontro-id",
    });
  } catch (error) {
    console.error(error);
  }
};
```

### **Buscar Participantes**

```typescript
import { useGetParticipantsFirebase } from "@/lib/hooks/useGetParticipantsFirebase";

const { data, isLoading } = useGetParticipantsFirebase({
  encounterId: "encontro-id",
  limit: 10,
  page: 1,
});

const participants = data?.data || [];
const total = data?.meta.total || 0;
```

### **Criar Sermão**

```typescript
import useCreateSermonFirebase from "@/lib/hooks/useCreateSermonFirebase";

const { mutateAsync: createSermon } = useCreateSermonFirebase();

const handleSubmit = async (values) => {
  try {
    const sermonId = await createSermon(values);
  } catch (error) {
    console.error(error);
  }
};
```

### **Buscar Sermões Publicados**

```typescript
import { useGetPublishedSermonsFirebase } from "@/lib/hooks/useGetSermonsFirebase";

const { data: sermons } = useGetPublishedSermonsFirebase({ limit: 10 });
```

### **Publicar Sermão**

```typescript
import { usePublishSermonFirebase } from "@/lib/hooks/useDeleteSermonFirebase";

const { mutateAsync: publishSermon } = usePublishSermonFirebase();

await publishSermon(sermonId);
```

## 🔒 Regras de Segurança do Firestore

### Modo Desenvolvimento (Apenas para testes)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Modo Produção (Seguro)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autenticação necessária
    match /participants/{document=**} {
      allow read, write: if request.auth != null;
    }

    match /sermons/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 📝 Checklist de Migração

- [ ] Configurar variáveis de ambiente do Firebase
- [ ] Habilitar Authentication no Firebase
- [ ] Habilitar Firestore Database
- [ ] Criar collections `participants` e `sermons`
- [ ] Atualizar componentes para usar novos hooks Firebase
- [ ] Remover hooks antigos (useCreateParticipant, etc)
- [ ] Testar funcionalidade de criação de participantes
- [ ] Testar funcionalidade de sermões
- [ ] Importar dados do Postgres (se necessário)
- [ ] Testar em produção

## 🚀 Próximos Passos

1. **Migração de Dados**:

   - Exportar dados do Postgres
   - Importar no Firestore

2. **Atualizar Componentes**:

   - `EncontroComDeusModal.tsx` → usar `useCreateParticipantFirebase`
   - `sermons/add/page.tsx` → usar `useCreateSermonFirebase`
   - Dashboard → usar `useGetSermonsFirebase`

3. **Autenticação**:

   - Implementar login com `authService.login()`
   - Implementar logout com `authService.logout()`

4. **Testes e Deploy**:
   - Testar localmente
   - Deploy para produção

## ⚠️ Diferenças Importantes

| Aspecto        | PostgreSQL        | Firebase          |
| -------------- | ----------------- | ----------------- |
| Query          | SQL               | Queries Firestore |
| Autenticação   | JWT Manual        | Firebase Auth     |
| Real-time      | Polling           | Listeners         |
| Escalabilidade | Banco tradicional | NoSQL distribuído |
| Custo          | Servidor dedicado | Pay-as-you-go     |

## 🆘 Troubleshooting

### Erro: "Missing or insufficient permissions"

- Verifique as regras de segurança do Firestore
- Certifique-se de estar autenticado

### Erro: "Invalid API Key"

- Verifique se as variáveis de ambiente estão corretas
- Gere novas chaves no Firebase Console

### Dados não aparecem

- Verifique se a collection existe no Firestore
- Verifique os nomes dos campos
- Use o Firestore Emulator para debug local
