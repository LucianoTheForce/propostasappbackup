'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import DynamicProposalTemplate from '@/components/dynamic-proposal-template'

// Default content structure to ensure all fields exist
const getDefaultContent = (proposalData: any) => ({
  title: proposalData.name || "THE FORCE",
  subtitle: "X THE FORCE",
  proposalTitle: proposalData.name || "Proposta de Projeto",
  clientName: proposalData.client || "Cliente",
  projectScope: [
    "Desenvolvimento completo da identidade visual",
    "Criação de key visual",
    "Manual da marca",
    "Aplicações digitais e impressas"
  ],
  deliverablesList: [
    {
      title: "Identidade Visual & Branding",
      description: "Desenvolvimento completo da identidade visual incluindo logo, tipografia, paleta de cores e elementos visuais distintivos.",
      number: "01"
    },
    {
      title: "Manual da Marca",
      description: "Guia abrangente de aplicação da marca com especificações técnicas, usos corretos e diretrizes de implementação.",
      number: "02"
    },
    {
      title: "Aplicações & Materiais",
      description: "Implementação da identidade em diversos materiais digitais e impressos, garantindo consistência visual.",
      number: "03"
    }
  ],
  proposal1Price: `R$ ${proposalData.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  proposal2Price: `R$ ${(proposalData.value * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  completePackagePrice: `R$ ${(proposalData.value * 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  projectDescription: "Criamos experiências visuais extraordinárias que conectam marcas aos seus públicos através de design inovador e tecnologia de ponta.",
  timelinePhases: [
    {
      phase: "Pesquisa e Conceito",
      duration: "2 semanas",
      description: "Análise de mercado, briefing e desenvolvimento conceitual"
    },
    {
      phase: "Criação Visual",
      duration: "3 semanas", 
      description: "Desenvolvimento da identidade visual e key visual"
    },
    {
      phase: "Aplicações",
      duration: "2 semanas",
      description: "Criação de materiais e manual da marca"
    },
    {
      phase: "Entrega Final",
      duration: "1 semana",
      description: "Revisões finais e entrega completa"
    }
  ],
  creativeApproach: "Nossa metodologia combina pesquisa de mercado, análise de tendências e criatividade para desenvolver soluções únicas que ressoam com o público-alvo.",
  conceptualFramework: "Este projeto visa desenvolver uma identidade visual completa e impactante, estabelecendo uma presença marcante no mercado através de design estratégico e execução impecável.",
  brandPersonality: ["Inovador", "Criativo", "Impactante", "Memorável", "Autêntico"],
  designPrinciples: [
    "Simplicidade elegante",
    "Impacto visual forte", 
    "Versatilidade de aplicação",
    "Atemporalidade"
  ],
  contactEmail: "contato@theforce.cc",
  contactPhone: "+55 (11) 99999-9999",
  proposalValidUntil: "30 dias a partir da data de envio",
  paymentTerms: [
    "50% na assinatura do contrato",
    "25% na aprovação do conceito",
    "25% na entrega final"
  ],
  deliveryTimeline: "6-8 semanas",
  revisionRounds: "3 rounds de revisão inclusos"
})

export default function ProposalClientPage({ slug }: { slug: string }) {
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        // Tentar buscar proposta específica
        let response = await fetch(`/api/proposals-mock/${slug}`)
        
        if (!response.ok) {
          // Se não encontrar, buscar todas e filtrar
          response = await fetch('/api/proposals-mock')
          const proposals = await response.json()
          const found = proposals.find((p: any) => p.slug === slug)
          
          if (found) {
            setProposal(found)
          } else {
            setError(true)
          }
        } else {
          const data = await response.json()
          setProposal(data)
        }
      } catch (err) {
        console.error('Erro ao buscar proposta:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Carregando proposta...</div>
      </div>
    )
  }

  if (error || !proposal) {
    notFound()
  }

  // Merge custom content with defaults
  const contentData = {
    ...getDefaultContent(proposal),
    ...(proposal.content_json || {})
  }

  return <DynamicProposalTemplate contentData={contentData} />
}