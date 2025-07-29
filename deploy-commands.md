# Comandos para Deploy

## 1. Conectar ao GitHub
```bash
cd alma2026-proposta
git remote add origin https://github.com/SEU_USERNAME/alma2026-proposta.git
git branch -M main
git push -u origin main
```

## 2. URL do projeto local
Sua pasta do projeto está em: `C:\propostasapp\alma2026-proposta`

## 3. Após push para GitHub
1. Vá para vercel.com e faça login
2. Clique em "New Project"  
3. Importe o repositório `alma2026-proposta`
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (já configurado)
   - Output Directory: `.next` (já configurado)
5. Clique em "Deploy"

## 4. Configurações já incluídas
- ✅ vercel.json configurado
- ✅ next.config.mjs otimizado
- ✅ Build commands corretos
- ✅ Projeto testado e funcionando

O deploy será automático e estará live em poucos minutos!