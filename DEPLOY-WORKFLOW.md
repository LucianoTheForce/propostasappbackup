# Deploy-First Development Workflow

## 🚀 Quick Start

This project uses a **deploy-first development approach** - test directly on Vercel instead of running locally.

### Why Deploy-First?
- **Real Performance**: Test 3D graphics, audio, and animations in production environment
- **Instant Sharing**: Share live URLs immediately with team/clients
- **Cross-Device Testing**: Test on mobile, tablets, different browsers instantly
- **Zero Setup**: No local server configuration needed

## 📱 Quick Deploy Commands

### Option 1: Use the Deploy Script (Recommended)
```bash
# Quick deploy with automatic commit message
./deploy.sh

# Deploy with custom commit message  
./deploy.sh "Added new 3D animation feature"
```

### Option 2: Manual Git Commands
```bash
git add .
git commit -m "your changes"
git push
```

### Option 3: Direct Vercel Deploy
```bash
# Install Vercel CLI first
npm install -g vercel

# Deploy immediately
vercel

# Deploy to production
vercel --prod
```

## 🔄 Development Cycle

1. **Edit Code**: Make changes in your local editor
2. **Deploy**: Run `./deploy.sh "description"` 
3. **Test Live**: Use Vercel preview URL
4. **Iterate**: Repeat for rapid development

## 🎯 Testing Checklist

### For ALMA 2026 Project:
- [ ] **3D Scene**: Test WebGL performance and Three.js interactions
- [ ] **Physics**: Validate cannon.js physics on touch devices  
- [ ] **Audio**: Check spatial audio and sound effects
- [ ] **Animations**: Test GSAP and Framer Motion performance
- [ ] **Mobile**: Verify touch interactions and responsive design
- [ ] **Cross-Browser**: Test on Chrome, Safari, Firefox, Edge

### For Proposal Management System:
- [ ] **Authentication**: Test Supabase login flow
- [ ] **AI Chat**: Verify OpenAI integration works
- [ ] **Database**: Check CRUD operations
- [ ] **Editor**: Test TipTap rich text editor
- [ ] **PDF Export**: Validate document generation
- [ ] **Mobile**: Test responsive dashboard

## 🛠️ Troubleshooting

### Deploy Issues
```bash
# Check deploy status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Rollback if needed
vercel rollback [deployment-url]
```

### Environment Variables
- Set in Vercel Dashboard > Settings > Environment Variables
- Different values for Preview vs Production
- Remember to redeploy after changing env vars

### Common Fixes
- **Build Errors**: Check Vercel deployment logs
- **Environment Issues**: Verify all required env vars are set
- **Performance**: Monitor Vercel analytics for issues

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **Analytics**: Track page views and core web vitals
- **Error Tracking**: Check function logs for runtime errors
- **Speed Insights**: Monitor loading performance

## 🎨 Best Practices

1. **Commit Messages**: Use descriptive messages for easier tracking
2. **Branch Strategy**: Use feature branches for major changes
3. **Environment Sync**: Keep env vars updated in Vercel dashboard
4. **Testing**: Test immediately after each deploy
5. **Rollback Ready**: Keep previous working deployment ready

## 🚀 Advanced Workflows

### Feature Branch Deploys
```bash
# Create feature branch
git checkout -b feature/new-animation

# Make changes and deploy to preview
./deploy.sh "WIP: new animation system"

# Merge when ready
git checkout main
git merge feature/new-animation
git push # Auto-deploys to production
```

### Hotfix Process
```bash
# Quick fix and immediate production deploy
./deploy.sh "hotfix: critical bug fix"
vercel --prod # Force immediate production deploy
```

---

**Remember**: This workflow prioritizes speed and real-world testing over local development complexity. Perfect for creative agencies and rapid prototyping! 