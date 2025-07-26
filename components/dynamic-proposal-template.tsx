"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import React from "react"
import Link from "next/link"

// Register GSAP plugins only on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Import components with error handling
import { Grid } from "@/components/grid"
import { VideoBackground } from "@/components/video-background"
import { AdvancedTextAnimation } from "@/components/advanced-text-animation"
import { ParallaxSection } from "@/components/parallax-section"
import { MagneticElement } from "@/components/magnetic-element"
import { CursorEffect } from "@/components/cursor-effect"
import { HoverScramble } from "@/components/hover-scramble"
import { Icon } from "@/components/icons"
import { DynamicText } from "@/components/dynamic-text"
import { InteractiveLogoHero } from "@/components/interactive-logo-hero"

// Interface for proposal data
interface ProposalContent {
  title: string
  subtitle: string
  proposalTitle: string
  clientName: string
  projectScope: string[]
  deliverablesList: Array<{
    title: string
    description: string
    number: string
  }>
  proposal1Price: string
  proposal2Price: string
  completePackagePrice: string
  projectDescription: string
  timelinePhases: Array<{
    phase: string
    duration: string
    description: string
  }>
  creativeApproach: string
  conceptualFramework: string
  brandPersonality: string[]
  designPrinciples: string[]
  contactEmail: string
  contactPhone: string
  proposalValidUntil: string
  paymentTerms: string[]
  deliveryTimeline: string
  revisionRounds: string
}

interface ProposalData {
  id: string
  name: string
  client: string
  value: number
  slug: string
  status: string
  content_json: ProposalContent
  created_at: string
  updated_at: string
}

interface DynamicProposalTemplateProps {
  proposalData: ProposalData
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  fallback: React.ReactNode
}> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any) {
    console.error("Error caught by boundary:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default function DynamicProposalTemplate({ proposalData }: DynamicProposalTemplateProps) {
  const [activeSection, setActiveSection] = useState("intro")
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const sections = ["intro", "manifesto", "about", "deliverables", "pricing", "terms"]
  const containerRef = useRef<HTMLDivElement>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  // Extract content for easy access
  const content = proposalData.content_json

  useEffect(() => {
    setIsBrowser(true)

    // Set loaded to true after a short delay to ensure smooth animations
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 500)

    // Show video background after delay
    const videoTimer = setTimeout(() => {
      setShowVideo(true)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(videoTimer)
    }
  }, [])

  const scrollToSection = (section: string) => {
    if (!isBrowser) return

    setActiveSection(section)
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMenuOpen(false)
  }

  if (!isBrowser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Error loading proposal</div>}>
      <div ref={containerRef} className="bg-black text-white overflow-x-hidden">
        <CursorEffect />
        <Grid />
        
        {showVideo && <VideoBackground />}

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                {content.title || "THE FORCE"}
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-sm uppercase tracking-wider transition-colors ${
                      activeSection === section ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>

              <button
                className="md:hidden text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`w-4 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                  <span className={`w-4 h-0.5 bg-white mt-1 transition-all ${menuOpen ? '-rotate-45 -translate-y-0.5' : ''}`} />
                </div>
              </button>
            </div>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden mt-4 space-y-4"
              >
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block text-sm uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    {section}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </nav>

        {/* Intro Section */}
        <section id="intro" className="min-h-screen flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
          
          <div className="relative z-20 text-center px-6">
            <ErrorBoundary fallback={<div className="text-6xl font-bold mb-4">{content.title}</div>}>
              <InteractiveLogoHero />
            </ErrorBoundary>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8"
            >
              <AdvancedTextAnimation type="letter" className="text-2xl md:text-4xl font-light mb-6">
                {content.subtitle || "X THE FORCE"}
              </AdvancedTextAnimation>
              
              <div className="max-w-4xl mx-auto">
                <AdvancedTextAnimation type="word" className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {content.proposalTitle || proposalData.name}
                </AdvancedTextAnimation>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ delay: 2, duration: 1 }}
              onClick={() => scrollToSection("manifesto")}
              className="mt-12 text-white/60 hover:text-white transition-colors"
            >
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </motion.button>
          </div>
        </section>

        {/* Manifesto Section */}
        <section id="manifesto" className="min-h-screen flex items-center justify-center py-20">
          <ParallaxSection speed={0.5}>
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto text-center">
                <AdvancedTextAnimation type="reveal" className="text-4xl md:text-6xl font-bold mb-8">
                  Para {content.clientName || proposalData.client}
                </AdvancedTextAnimation>
                
                <div className="max-w-4xl mx-auto mb-12">
                  <AdvancedTextAnimation type="fade" className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    {content.projectDescription || "Criamos experiências visuais extraordinárias que conectam marcas aos seus públicos através de design inovador e tecnologia de ponta."}
                  </AdvancedTextAnimation>
                </div>

                <ErrorBoundary fallback={<div>Dynamic content loading...</div>}>
                  <DynamicText 
                    phrases={content.brandPersonality || ["Inovador", "Criativo", "Impactante", "Memorável"]}
                    className="text-2xl md:text-3xl font-light text-white/80"
                  />
                </ErrorBoundary>
              </div>
            </div>
          </ParallaxSection>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <AdvancedTextAnimation type="slide" className="text-3xl md:text-5xl font-bold mb-16 text-center">
                Escopo do Projeto
              </AdvancedTextAnimation>

              <div className="grid md:grid-cols-2 gap-16 items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Visão Geral</h3>
                  <p className="text-gray-300 leading-relaxed mb-8">
                    {content.conceptualFramework || "Este projeto visa desenvolver uma identidade visual completa e impactante, estabelecendo uma presença marcante no mercado através de design estratégico e execução impecável."}
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-6">Abordagem Criativa</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {content.creativeApproach || "Nossa metodologia combina pesquisa de mercado, análise de tendências e criatividade para desenvolver soluções únicas que ressoam com o público-alvo."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-6">Entregáveis Principais</h3>
                  <div className="space-y-4">
                    {(content.projectScope || [
                      "Desenvolvimento completo da identidade visual",
                      "Criação de key visual",
                      "Manual da marca",
                      "Aplicações digitais e impressas"
                    ]).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables Section */}
        <section id="deliverables" className="py-20 bg-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <AdvancedTextAnimation type="reveal" className="text-3xl md:text-5xl font-bold mb-16 text-center">
                Entregáveis Detalhados
              </AdvancedTextAnimation>

              <div className="grid md:grid-cols-3 gap-8">
                {(content.deliverablesList || [
                  {
                    title: "Identidade Visual",
                    description: "Logo, tipografia, paleta de cores e elementos visuais",
                    number: "01"
                  },
                  {
                    title: "Manual da Marca",
                    description: "Guia completo de aplicação da identidade",
                    number: "02"
                  },
                  {
                    title: "Aplicações",
                    description: "Materiais digitais e impressos",
                    number: "03"
                  }
                ]).map((deliverable, index) => (
                  <MagneticElement key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:border-white/20 transition-colors"
                    >
                      <div className="text-4xl font-bold text-white/20 mb-4">
                        {deliverable.number}
                      </div>
                      <h3 className="text-xl font-semibold mb-4">
                        {deliverable.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {deliverable.description}
                      </p>
                    </motion.div>
                  </MagneticElement>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <AdvancedTextAnimation type="slide" className="text-3xl md:text-5xl font-bold mb-16 text-center">
                Investimento
              </AdvancedTextAnimation>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <MagneticElement>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-8 hover:border-white/20 transition-colors">
                    <h3 className="text-2xl font-semibold mb-4">Proposta Essencial</h3>
                    <div className="text-4xl font-bold mb-6">
                      {content.proposal1Price || `R$ ${proposalData.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </div>
                    <p className="text-gray-300 mb-6">
                      Identidade visual completa com aplicações básicas
                    </p>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Logo e variações
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Paleta de cores
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Tipografia
                      </li>
                    </ul>
                  </div>
                </MagneticElement>

                <MagneticElement>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-8 hover:border-white/20 transition-colors relative">
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm">
                      Recomendado
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">Proposta Completa</h3>
                    <div className="text-4xl font-bold mb-6">
                      {content.proposal2Price || `R$ ${(proposalData.value * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </div>
                    <p className="text-gray-300 mb-6">
                      Solução completa com todas as aplicações
                    </p>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Tudo da proposta essencial
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Manual da marca
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Aplicações digitais
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="w-4 h-4 mr-3 text-green-400" />
                        Materiais impressos
                      </li>
                    </ul>
                  </div>
                </MagneticElement>
              </div>

              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Prazo de entrega: {content.deliveryTimeline || "6-8 semanas"}
                </p>
                <p className="text-gray-400">
                  Rodadas de revisão: {content.revisionRounds || "3 rounds inclusos"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section id="terms" className="py-20 bg-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AdvancedTextAnimation type="fade" className="text-3xl md:text-5xl font-bold mb-16 text-center">
                Termos e Contato
              </AdvancedTextAnimation>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Termos de Pagamento</h3>
                  <ul className="space-y-3 text-gray-300 mb-8">
                    {(content.paymentTerms || [
                      "50% na assinatura do contrato",
                      "50% na entrega final"
                    ]).map((term, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="w-4 h-4 mr-3 mt-1 text-blue-400 flex-shrink-0" />
                        {term}
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm text-gray-400">
                    Proposta válida até: {content.proposalValidUntil || "30 dias"}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-6">Contato</h3>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      <strong>Email:</strong> {content.contactEmail || "contato@theforce.cc"}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {content.contactPhone || "+55 (11) 99999-9999"}
                    </p>
                  </div>

                  <MagneticElement>
                    <button className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                      Aprovar Proposta
                    </button>
                  </MagneticElement>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} THE FORCE. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}