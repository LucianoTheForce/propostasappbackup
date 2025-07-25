# Configuração do Google OAuth

## Passos para configurar autenticação com Google:

### 1. Criar projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+ (se necessário)

### 2. Criar credenciais OAuth 2.0
1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth client ID"
3. Escolha "Web application"
4. Configure:
   - **Nome**: PropostasApp (ou outro nome)
   - **Authorized JavaScript origins**: 
     - http://localhost:3000 (desenvolvimento)
     - https://sua-url.vercel.app (produção)
   - **Authorized redirect URIs**:
     - http://localhost:3000/api/auth/callback/google (desenvolvimento)
     - https://sua-url.vercel.app/api/auth/callback/google (produção)
5. Clique em "Create"

### 3. Copiar as credenciais
Após criar, você receberá:
- **Client ID**: cole em `GOOGLE_CLIENT_ID`
- **Client Secret**: cole em `GOOGLE_CLIENT_SECRET`

### 4. Adicionar no Vercel
1. Vá para o dashboard do Vercel
2. Settings > Environment Variables
3. Adicione:
   - `GOOGLE_CLIENT_ID` = seu_client_id
   - `GOOGLE_CLIENT_SECRET` = seu_client_secret

### 5. URLs importantes no Vercel
Certifique-se de adicionar no Google Console:
- https://sua-url-vercel.vercel.app/api/auth/callback/google

## Funcionamento:
- O primeiro usuário que fizer login com Google será automaticamente ADMIN
- Os próximos serão usuários normais
- Não é necessário criar conta manualmente no Supabase