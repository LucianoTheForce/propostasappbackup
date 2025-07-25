# 🔧 Troubleshooting - Sistema de Propostas

## Erro: "Usuário Inválido"

### Passos para resolver:

#### 1. **Verificar variáveis de ambiente**
Execute o script de debug:
```bash
node debug-auth.js
```

Ou verifique manualmente no `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role do Supabase
- `NEXTAUTH_SECRET` - Uma string aleatória

#### 2. **Executar o schema SQL**
1. Vá para Supabase Dashboard > SQL Editor
2. Cole o conteúdo do arquivo `supabase-schema.sql`
3. Clique em RUN
4. Verifique se não há erros

#### 3. **Criar usuário no Supabase Auth**
1. Vá para Authentication > Users
2. Clique "Add user"
3. Adicione um email e senha
4. **Importante**: Use um email real que você tenha acesso

#### 4. **Testar login**
1. Vá para sua aplicação
2. Tente fazer login com o email/senha criados
3. O sistema criará automaticamente o usuário na tabela `users`

## Outros Problemas Comuns

### Erro de conexão com Supabase
```
Error: Invalid API key
```
**Solução**: Verifique se as chaves do Supabase estão corretas no `.env.local`

### Erro de NextAuth
```
[next-auth][error][JWT_SESSION_ERROR]
```
**Solução**: Verifique se `NEXTAUTH_SECRET` está definido

### Tabelas não existem
```
relation "public.users" does not exist
```
**Solução**: Execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase

### Problema de CORS
```
Access to fetch blocked by CORS policy
```
**Solução**: Verifique se `NEXTAUTH_URL` está correto para seu ambiente

## Script de Debug

Execute este comando para diagnosticar problemas:
```bash
node debug-auth.js
```

Ele verificará:
- ✅ Variáveis de ambiente
- ✅ Conexão com Supabase
- ✅ Existência das tabelas
- ✅ Usuários na tabela users
- ✅ Usuários no Supabase Auth

## Configuração de Exemplo

Arquivo `.env.local` correto:
```env
# Supabase (pegue no Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-string-aleatoria-aqui

# OpenAI (opcional para AI)
OPENAI_API_KEY=sk-...
```

## Como obter as chaves do Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Entre no seu projeto
3. Vá para Settings > API
4. Copie:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY`

## Gerar NEXTAUTH_SECRET

Execute no terminal:
```bash
openssl rand -base64 32
```

Ou use um gerador online de strings aleatórias.

## Ainda com problemas?

1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do terminal onde roda `npm run dev`
3. Execute `node debug-auth.js` para diagnóstico completo
4. Verifique se o Supabase está online e funcionando