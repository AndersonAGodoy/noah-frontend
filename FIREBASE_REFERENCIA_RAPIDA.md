# 🔥 Firebase Firestore - Referência Rápida

## 🎯 Estrutura de Serviços

### authService

```typescript
import { authService } from "@/lib/firebase/services";

// Login
const { user, token } = await authService.login(email, password);

// Register
const { user, token } = await authService.register(email, password);

// Logout
await authService.logout();

// Current user
const user = authService.getCurrentUser();

// Get token
const token = await authService.getCurrentUserToken();
```

### participantsService

```typescript
import { participantsService } from "@/lib/firebase/services";

// Create
const id = await participantsService.createParticipant(data);

// Get all with pagination
const { data, total, page, totalPages } =
  await participantsService.getParticipants(encounterId, 10, 1);

// Get by ID
const participant = await participantsService.getParticipant(id);

// Update
await participantsService.updateParticipant(id, data);

// Delete
await participantsService.deleteParticipant(id);

// Get by email
const participant = await participantsService.getParticipantByEmail(email);
```

### sermonsService

```typescript
import { sermonsService } from "@/lib/firebase/services";

// Create
const id = await sermonsService.createSermon(data);

// Get all with pagination
const { data, total, page, totalPages } = await sermonsService.getSermons(
  10,
  1
);

// Get by ID
const sermon = await sermonsService.getSermon(id);

// Update
await sermonsService.updateSermon(id, data);

// Delete
await sermonsService.deleteSermon(id);

// Get published
const sermons = await sermonsService.getPublishedSermons(10);

// Publish
await sermonsService.publishSermon(id);
```

## 🎣 Hooks Firebase

### Participantes

```typescript
import useCreateParticipantFirebase from "@/lib/hooks/useCreateParticipantFirebase";
import { useGetParticipantsFirebase } from "@/lib/hooks/useGetParticipantsFirebase";

// Create
const { mutateAsync: create } = useCreateParticipantFirebase();
await create({ ...data, encounterId: "id" });

// Get
const { data, isLoading } = useGetParticipantsFirebase({
  encounterId: "id",
  limit: 10,
  page: 1,
});
```

### Sermões

```typescript
import useCreateSermonFirebase from '@/lib/hooks/useCreateSermonFirebase';
import useUpdateSermonFirebase from '@/lib/hooks/useUpdateSermonFirebase';
import useDeleteSermonFirebase, { usePublishSermonFirebase } from '@/lib/hooks/useDeleteSermonFirebase';
import {
  useGetSermonsFirebase,
  useGetPublishedSermonsFirebase,
  useGetSermonFirebase
} from '@/lib/hooks/useGetSermonsFirebase';

// Create
const { mutateAsync: create } = useCreateSermonFirebase();
await create(data);

// Update
const { mutateAsync: update } = useUpdateSermonFirebase();
await update({ id, data });

// Delete
const { mutateAsync: delete } = useDeleteSermonFirebase();
await delete(id);

// Publish
const { mutateAsync: publish } = usePublishSermonFirebase();
await publish(id);

// Get all
const { data } = useGetSermonsFirebase({ limit: 10, page: 1 });

// Get published
const { data: sermons } = useGetPublishedSermonsFirebase({ limit: 10 });

// Get by ID
const { data: sermon } = useGetSermonFirebase(sermonId);
```

## 🔗 Mudanças no Firebase vs PostgreSQL

### Autenticação

- **PostgreSQL**: Manual JWT
- **Firebase**: `authService.login()` / `authService.logout()`

### CRUD

- **PostgreSQL**: `fetch('/api/participants')`
- **Firebase**: `participantsService.createParticipant()`

### Paginação

- **PostgreSQL**: `page`, `limit`, `offset`
- **Firebase**: `page`, `pageSize` com arrays de documentos

### Real-time

- **PostgreSQL**: Polling necessário
- **Firebase**: Listeners em tempo real (opcional)

## 🚀 Passo-a-Passo para Migrar Componente

1. **Remova o hook antigo**:

   ```typescript
   // ❌ Remova
   const { mutate } = useCreateParticipant();
   ```

2. **Importe o novo hook**:

   ```typescript
   // ✅ Adicione
   import useCreateParticipantFirebase from "@/lib/hooks/useCreateParticipantFirebase";
   ```

3. **Use mutateAsync**:

   ```typescript
   // ❌ Antigo
   mutate(data);

   // ✅ Novo
   const { mutateAsync } = useCreateParticipantFirebase();
   await mutateAsync({ ...data, encounterId: "id" });
   ```

4. **Adicione tratamento de erro**:
   ```typescript
   try {
     await mutateAsync(data);
     // sucesso
   } catch (error) {
     // erro
   }
   ```

## 📊 Collections Firestore

### participants

- `name` (string)
- `email` (string)
- `phoneNumber` (string)
- `age` (number)
- `address` (string | null)
- `observations` (string)
- `typeOfParticipation` (enum)
- `encounterId` (string)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### sermons

- `title` (string)
- `description` (string)
- `speaker` (string)
- `duration` (string)
- `date` (string)
- `time` (string)
- `eventType` (enum)
- `isPublished` (boolean)
- `references` (array)
- `contentSections` (array)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `publishedAt` (timestamp | null)
