# 🐛 Erros Comuns em Desenvolvimento - Next.js

## ✅ **Erros NORMAIS que podem ser ignorados:**

### 1. **SWC Dependencies Warning**

```
⚠ Found lockfile missing swc dependencies, patching...
```

- **Causa**: Next.js tentando otimizar o compilador SWC
- **Ação**: Ignorar - não afeta o funcionamento
- **Produção**: Não aparece em build de produção

### 2. **React DevTools Warnings**

```
Warning: ReactDOM.render is deprecated in React 18
```

- **Causa**: Bibliotecas ainda não atualizadas para React 18
- **Ação**: Aguardar atualizações das bibliotecas
- **Produção**: Não aparecem no console de produção

### 3. **Hot Reload Messages**

```
[HMR] Updated modules:
```

- **Causa**: Fast Refresh atualizando componentes
- **Ação**: Normal - indica que o hot reload está funcionando
- **Produção**: Não existe em produção

### 4. **React Query DevTools**

```
React Query DevTools detected
```

- **Causa**: DevTools ativo em desenvolvimento
- **Ação**: Normal - ajuda no debugging
- **Produção**: Automaticamente desabilitado

## ⚠️ **Erros que DEVEM ser corrigidos:**

### 1. **API Connection Errors**

```
Failed to fetch: TypeError: Failed to fetch
```

- **Causa**: API não disponível ou CORS
- **Ação**: Configurar `NEXT_PUBLIC_API_URL` ou mockar dados
- **Solução**: Ver arquivo `.env.example`

### 2. **TypeScript Errors**

```
Property 'x' does not exist on type 'y'
```

- **Causa**: Tipos incorretos ou faltando
- **Ação**: Corrigir tipos ou usar type assertion
- **Solução**: Sempre corrigir antes do build

### 3. **ESLint Warnings**

```
'variable' is assigned a value but never used
```

- **Causa**: Código não utilizado
- **Ação**: Remover ou usar a variável
- **Solução**: `yarn lint --fix`

## 🔧 **Como Debuggar Erros de Formulário:**

### 1. **Network Tab**

- Abra DevTools → Network
- Submeta o formulário
- Verifique se a requisição foi enviada
- Analise status code e response

### 2. **Console Tab**

- Erros do JavaScript aparecem aqui
- Use `console.log()` para debug
- Verifique stack trace completo

### 3. **React Query DevTools**

- Instale a extensão do navegador
- Monitore mutations e queries
- Veja cache e estados

## 📝 **Configuração Recomendada para Development:**

### `.env.local`

```env
# Para desenvolvimento local
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Para mockear dados (opcional)
NEXT_PUBLIC_MOCK_API=true
```

### `next.config.mjs`

```javascript
const nextConfig = {
  // Silencia warnings específicos em dev
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
```

## 🚀 **Comandos Úteis:**

```bash
# Verificar erros de tipos
yarn build

# Verificar ESLint
yarn lint

# Limpar cache do Next.js
yarn dev --reset-cache

# Build para produção
yarn build && yarn start
```

## 💡 **Dicas:**

1. **Sempre teste o build** antes de fazer deploy
2. **Use TypeScript strict mode** para catch errors cedo
3. **Configure ESLint** para manter código limpo
4. **Use React Query DevTools** para debug de data fetching
5. **Monitore Network tab** para problemas de API

---

**📌 Resumo**: A maioria dos warnings em desenvolvimento são normais e não afetam a produção. Foque em corrigir apenas errors que quebram funcionalidade.
