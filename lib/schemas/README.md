# Validação de Formulários com Zod

Este projeto utiliza [Zod](https://zod.dev/) para validação de formulários, integrado com o Mantine Form.

## Schemas Disponíveis

### 1. Login Schema (`loginSchema`)

- **email**: Email válido obrigatório
- **password**: Mínimo 6 caracteres, máximo 50

### 2. Encontro com Deus Schema (`encontroComDeusSchema`)

- **nome**: 2-100 caracteres, apenas letras e espaços
- **telefone**: Formato brasileiro de telefone
- **email**: Email válido obrigatório
- **idade**: Número inteiro entre 1-120
- **endereco**: 5-200 caracteres (opcional)
- **observacoes**: Máximo 500 caracteres (opcional)
- **tipoParticipacao**: Enum com valores válidos

### 3. Sermon Schema (`sermonSchema` e `updateSermonSchema`)

- **title**: 3-200 caracteres
- **description**: 10-500 caracteres
- **speaker**: 2-100 caracteres
- **duration**: Formato HH:MM (opcional)
- **date**: Formato YYYY-MM-DD
- **time**: Formato HH:MM (opcional)
- **eventType**: Enum com tipos de evento
- **references**: Array de referências bíblicas (mínimo 1)
- **contentSections**: Array de seções de conteúdo (mínimo 1)

## Como Usar

### 1. Importar os schemas

\`\`\`typescript
import { loginSchema, encontroComDeusSchema, sermonSchema } from '../lib/schemas';
import { zodResolver } from '../lib/utils/zodResolver';
\`\`\`

### 2. Configurar o formulário

\`\`\`typescript
const form = useForm<LoginFormData>({
mode: 'uncontrolled',
initialValues: {
email: "",
password: "",
},
validate: zodResolver(loginSchema),
});
\`\`\`

### 3. Usar no JSX

\`\`\`tsx
<TextInput
label="Email"
{...form.getInputProps('email')}
type="email"
required
/>
\`\`\`

### 4. Submit com validação

\`\`\`typescript
const handleSubmit = (values: LoginFormData) => {
// Os dados já estão validados aqui
console.log(values);
};

<form onSubmit={form.onSubmit(handleSubmit)}>
  {/* campos do formulário */}
</form>
\`\`\`

## Benefícios

- ✅ **Validação rigorosa**: Tipos seguros em TypeScript
- ✅ **Mensagens de erro customizadas**: Feedback claro para o usuário
- ✅ **Reutilização**: Schemas podem ser reutilizados em diferentes componentes
- ✅ **Manutenibilidade**: Lógica de validação centralizada
- ✅ **Performance**: Validação eficiente no cliente
- ✅ **Experiência do usuário**: Validação em tempo real

## Estrutura de Arquivos

\`\`\`
lib/
schemas/
├── index.ts # Exporta todos os schemas
├── loginSchema.ts # Schema de login
├── encontroComDeusSchema.ts # Schema do encontro
└── sermonSchema.ts # Schemas de sermão
utils/
└── zodResolver.ts # Integração Zod + Mantine Form
\`\`\`
