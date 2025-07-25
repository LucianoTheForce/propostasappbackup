# THE FORCE Proposal Management System - Setup Guide

## Overview
This system transforms your existing proposal site into a comprehensive proposal management dashboard with AI-powered editing capabilities.

## Development Approach: Deploy-First Development 🚀

**Recommended workflow**: Skip local development and test directly on Vercel's platform for faster iteration and real-world testing.

### Why Deploy-First?
- **Real Environment Testing**: Test in production-like conditions from day one
- **Faster Feedback**: No local setup complexity, immediate live URLs
- **Team Collaboration**: Instant sharing with stakeholders
- **Zero Configuration**: Vercel handles build optimization automatically

### Prerequisites
1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **OpenAI API Key**: Get your API key from [platform.openai.com](https://platform.openai.com)
3. **Vercel Account**: Required for deploy-first development
4. **GitHub Repository**: For continuous deployment

## Step 1: Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to Settings > API to get your project URL and anon key

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql` and run it
3. This will create all necessary tables and security policies

### 1.3 Create First User
Since we're using Supabase Auth, you need to create your first admin user:

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user" and create an admin account with email and password
3. The system will now automatically create the user in your users table when they first log in!

**✨ Nova funcionalidade**: O sistema agora cria automaticamente o usuário na tabela `users` quando ele faz login pela primeira vez. O primeiro usuário sempre será criado como admin.

## Step 2: Deploy-First Setup

### 2.1 Vercel Configuration
Your project is already configured with `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev", 
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 2.2 Environment Variables Setup
Add these environment variables directly in your Vercel dashboard (Settings > Environment Variables):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (use your Vercel domain)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-random-secret-string

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Database URL (optional)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 2.3 Quick Deploy Commands

**Initial Deploy:**
```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy (will prompt for configuration)
vercel

# Or deploy with custom settings
vercel --prod
```

**Continuous Deployment:**
- Every push to main branch automatically deploys
- Preview deployments for all pull requests
- Instant rollbacks if needed

## Step 3: Deploy-First Development Workflow

### 3.1 Development Cycle
1. **Make Changes**: Edit code locally in your editor
2. **Push to GitHub**: `git add .` → `git commit -m "update"` → `git push`
3. **Auto-Deploy**: Vercel automatically builds and deploys
4. **Test Live**: Use the Vercel preview URL to test changes
5. **Iterate**: Repeat cycle for rapid development

### 3.2 Quick Deploy Script
Add this to your workflow for faster deployments:

```bash
# Quick deploy script (save as deploy.sh)
#!/bin/bash
git add .
git commit -m "${1:-Quick update}"
git push
echo "🚀 Deployed! Check Vercel dashboard for live URL"
```

Usage: `./deploy.sh "Added new feature"`

### 3.3 Environment-Specific Testing
- **Preview**: Test features on preview deployments before merging
- **Production**: Main branch always reflects live production state
- **Rollback**: Use Vercel dashboard to instantly rollback if needed

## Step 4: First Deploy & Testing

### 4.1 Initial Deploy
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard  
4. Deploy and get your live URL

### 4.2 First Login Test
1. Go to your Vercel deployment URL
2. You'll be redirected to the login page
3. Use the email and password from the Supabase user you created
4. Verify you're redirected to the dashboard

### 4.3 Create Your First Proposal
1. In the live dashboard, click "New Proposal"
2. Fill in the proposal details
3. Click "Create Proposal"
4. Test the AI chat interface in the live environment

## Features Overview

### Dashboard Features
- **Proposal Table**: View all proposals with status, client, value, etc.
- **Search & Filter**: Find proposals quickly
- **Statistics**: Total proposals, values, approval rates
- **Quick Actions**: View, edit, export proposals

### Editor Features
- **WYSIWYG Editor**: Rich text editing with TipTap
- **AI Chat Assistant**: Movable chat window for content generation
- **Inline Editing**: Click any text to edit directly
- **Text Selection Toolbar**: Format selected text
- **Auto-save**: Changes are saved automatically

### AI Commands
The AI assistant responds to commands like:
- "Generate pricing section for branding services"
- "Rewrite this paragraph more professionally"
- "Add technical specifications for web development"
- "Create an executive summary"
- "Translate this to English/Portuguese"

## Routing Structure

- `/` - Homepage (redirects to dashboard)
- `/login` - Authentication page
- `/dashboard` - Main proposal management dashboard
- `/proposals/new` - Create new proposal
- `/proposals/[slug]` - Public proposal view (shareable)
- `/proposals/[slug]/edit` - AI-powered proposal editor

## Deployment

### Using Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Make sure to add all environment variables from `.env.local` to your production environment, updating the `NEXTAUTH_URL` to your production domain.

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check your Supabase credentials and NextAuth configuration
2. **AI chat not responding**: Verify your OpenAI API key is valid and has credits
3. **Database errors**: Ensure the SQL schema was run correctly in Supabase
4. **Build errors**: Run `npm run build` locally to catch any TypeScript errors

### Support
If you encounter issues, check:
1. Browser console for JavaScript errors
2. Network tab for failed API requests
3. Supabase logs for database issues
4. Vercel logs for deployment issues

## Next Steps

1. **Customize Styling**: Modify the components to match your brand
2. **Add More Templates**: Create proposal templates in the new proposal page
3. **PDF Export**: Implement PDF generation for proposals
4. **Email Integration**: Add email sending for proposal sharing
5. **Analytics**: Track proposal views and engagement

Your proposal management system is now ready for use!

## Alternative: Local Development (If Needed)

If you need to run locally for debugging:

### Local Setup
```bash
npm install
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

**Note**: Remember to update `NEXTAUTH_URL=http://localhost:3000` for local development, then change back to your Vercel domain for production.