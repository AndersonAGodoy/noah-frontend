# 📄 Paginação de Participantes - Guia de Uso

## 🎯 **Tipos de Paginação Implementados**

### 1. **Paginação Infinita** (`useGetParticipants`)

Para listas com scroll infinito ou botão "Carregar mais"

```typescript
import useGetParticipants from "../lib/hooks/useGetParticipants";

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  error,
} = useGetParticipants({
  limit: 10,
  encounterId: "encounter-id",
});

// Todos os participantes de todas as páginas carregadas
const allParticipants = data?.pages?.flatMap((page) => page.data) || [];

// Metadados da última página
const lastPageMeta = data?.pages?.[data.pages.length - 1]?.meta;
```

### 2. **Paginação Tradicional** (`useGetParticipantsPage`)

Para paginação com botões Anterior/Próximo

```typescript
import { useGetParticipantsPage } from "../lib/hooks/useGetParticipantsPage";

const [currentPage, setCurrentPage] = useState(1);

const { data, isLoading, error } = useGetParticipantsPage({
  limit: 10,
  page: currentPage,
  encounterId: "encounter-id",
});

// Participantes da página atual
const participants = data?.data || [];

// Metadados da paginação
const meta = data?.meta;
```

## 📊 **Estrutura dos Dados**

### **ParticipantPage Interface**

```typescript
type ParticipantPage = {
  data: Participant[]; // Array de participantes
  meta: {
    total: number; // Total de participantes
    page: number; // Página atual
    limit: number; // Itens por página
    totalPages: number; // Total de páginas
    hasNextPage: boolean; // Tem próxima página?
    hasPreviousPage: boolean; // Tem página anterior?
  };
};
```

### **Participant Interface**

```typescript
type Participant = {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string | null;
  observations: string;
  typeOfParticipation: "firstTime" | "returning" | "leadership";
  phoneNumber: string;
  encounterId: string;
};
```

## 🛠️ **Exemplos de Uso no Componente**

### **Exemplo 1: Lista com Scroll Infinito**

```tsx
export function ParticipantsList({ encounterId }: { encounterId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetParticipants({ limit: 10, encounterId });

  const allParticipants = data?.pages?.flatMap((page) => page.data) || [];

  return (
    <div>
      {allParticipants.map((participant) => (
        <ParticipantCard key={participant.id} participant={participant} />
      ))}

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
          Carregar mais
        </Button>
      )}
    </div>
  );
}
```

### **Exemplo 2: Paginação com Botões**

```tsx
export function ParticipantsTable({ encounterId }: { encounterId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetParticipantsPage({
    limit: 10,
    page,
    encounterId,
  });

  return (
    <div>
      <Table>
        {data?.data.map((participant) => (
          <Table.Tr key={participant.id}>
            <Table.Td>{participant.name}</Table.Td>
            <Table.Td>{participant.email}</Table.Td>
            <Table.Td>{participant.age}</Table.Td>
          </Table.Tr>
        ))}
      </Table>

      <Pagination
        total={data?.meta.totalPages || 1}
        value={page}
        onChange={setPage}
      />

      <Text size="sm">
        Mostrando {data?.data.length} de {data?.meta.total} participantes
      </Text>
    </div>
  );
}
```

## 🔄 **Invalidação de Cache**

Quando um participante é criado/atualizado/deletado:

```typescript
// No hook de mutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["participants"] });
  // Isso irá recarregar automaticamente todas as consultas de participantes
},
```

## ⚙️ **Configuração da API**

### **Endpoint Esperado**

```
GET /encounter/{encounterId}/participants?page=1&limit=10
```

### **Resposta Esperada**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "age": 30,
      "address": "São Paulo, SP",
      "observations": "Primeira vez no encontro",
      "typeOfParticipation": "firstTime",
      "phoneNumber": "+5511999999999",
      "encounterId": "encounter-uuid"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🎨 **Componentes UI Recomendados**

```tsx
// Para mostrar status de carregamento
{isLoading && <Loader />}

// Para mostrar informações da paginação
<Text size="sm">
  Página {meta?.page} de {meta?.totalPages}
  ({meta?.total} participantes)
</Text>

// Para navegação
<Group justify="space-between">
  <Button disabled={!meta?.hasPreviousPage}>
    Anterior
  </Button>
  <Button disabled={!meta?.hasNextPage}>
    Próxima
  </Button>
</Group>
```

## 🚀 **Performance Tips**

1. **Use staleTime**: Evita requisições desnecessárias
2. **Configure gcTime**: Controla cache em memória
3. **Desabilite refetch automático**: Para melhor UX
4. **Use queryKey específicas**: Para cache granular

```typescript
// Configuração otimizada
staleTime: 30 * 1000,        // 30 segundos
gcTime: 5 * 60 * 1000,       // 5 minutos
refetchOnWindowFocus: false,
refetchOnReconnect: false,
```
