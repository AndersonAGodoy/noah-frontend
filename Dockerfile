FROM node:22-alpine AS builder

WORKDIR /app

# 1. Instala dependências de build
RUN apk add --no-cache git

# 2. Copia e instala dependências (cache otimizado)
COPY package.json package-lock.json ./


# 3. Copia o código e faz build
COPY . .
RUN npm run build

# --- Estágio de produção ---
FROM node:22-alpine

WORKDIR /app

# 1. Copia apenas o necessário
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 2. Configuração do ambiente
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# 3. COMANDO CORRETO para Next.js moderno:
CMD ["npm", "start"]