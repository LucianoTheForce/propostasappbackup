# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"ALMA 2026" is a sophisticated brand proposal website built with Next.js, featuring immersive 3D elements, advanced text animations, and audio interactions. It's a creative showcase for THE FORCE agency's visual identity and club room design proposal for ALMA 2026.

## Development Commands

### Core Development
- `npm run dev` - Start development server (default: http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Package Management
- Uses `pnpm` package manager (pnpm-lock.yaml present)
- Dependencies managed in package.json

## Architecture & Key Technologies

### Framework & UI
- **Next.js 14** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS** for styling with custom configurations
- **Shadcn/ui** components library integration
- **Framer Motion** for animations
- **GSAP** with ScrollTrigger for advanced animations

### 3D Graphics & Effects
- **React Three Fiber** (@react-three/fiber) for 3D scenes
- **React Three Drei** (@react-three/drei) for 3D utilities
- **Three.js** for WebGL rendering
- **Postprocessing** effects (Bloom, ChromaticAberration)
- **Cannon.js** physics engine for interactions

### Audio System
- Custom audio management with sound effects
- Spatial audio positioning based on 3D interactions
- Touch and mouse interaction sound feedback

### Styling Architecture
- Custom CSS variables in Tailwind config
- Responsive design with mobile-first approach
- Custom typography using Inter font family
- CSS-in-JS with Emotion for specific components

## Component Structure

### Custom Components (`/components/`)
- **3D Scene**: `three-js-scene.tsx` - Main 3D interactive component with physics
- **Animations**: `advanced-text-animation.tsx` - Multi-type text animation system
- **Audio**: `audio-player.tsx`, `audio-control.tsx` - Audio management
- **Interactive**: `magnetic-element.tsx`, `cursor-effect.tsx` - Mouse interactions
- **UI Components**: Extensive shadcn/ui component library in `/components/ui/`

### Main Application
- **App Router**: `/app/page.tsx` - Single-page application with multiple sections
- **Layout**: `/app/layout.tsx` - Global layout and metadata
- **Styles**: `/app/globals.css` - Global styles and CSS variables

## Development Guidelines

### Code Conventions
- Use TypeScript with strict type checking
- Follow React functional component patterns
- Use custom hooks for reusable logic
- Implement proper error boundaries for 3D components
- Handle browser compatibility (SSR-safe components)

### Performance Considerations
- 3D components are client-side only (`"use client"`)
- Dynamic imports for heavy components
- WebGL context cleanup and error handling
- Responsive 3D rendering with performance optimization
- Frame rate limiting and demand-based rendering

### Browser Support
- WebGL detection and fallback handling
- Touch device detection for mobile optimization
- Progressive enhancement for 3D features
- Error boundaries for graceful degradation

## Build Configuration

### Next.js Config (`next.config.mjs`)
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Unoptimized images for better compatibility

### Special Features
- Interactive 3D "Monad" component with physics-based rotation
- Multi-language content (Portuguese/English)
- Sophisticated animation system with GSAP and Framer Motion
- Audio-reactive elements
- Custom cursor effects
- Magnetic hover interactions

## Development Notes
- Extensive use of refs for DOM manipulation
- Custom easing functions and animation patterns
- Physics-based interactions with touch/mouse support
- Complex state management for 3D scene interactions
- Audio system integrated with visual feedback