import { NextRequest, NextResponse } from 'next/server'

// Mock data para propostas específicas
const mockProposals: any = {
  'visual-identity-alma-2026-club-experience': {
    id: '1',
    name: 'Visual Identity - ALMA 2026 Club Experience',
    client: 'ALMA 2026',
    value: 275000,
    slug: 'visual-identity-alma-2026-club-experience',
    status: 'sent',
    version: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Visual Identity - ALMA 2026 Club Experience",
      clientName: "ALMA 2026",
      projectScope: [
        "Desenvolvimento completo da identidade visual",
        "Criação de key visual (estático + animado)",
        "Manual da marca com diretrizes técnicas",
        "Aplicações digitais e impressas",
        "Estratégia de comunicação visual",
        "Templates personalizados"
      ],
      deliverablesList: [
        {
          title: "Identidade Visual & Branding",
          description: "Desenvolvimento completo da identidade visual incluindo logo, tipografia, paleta de cores e elementos visuais distintivos que refletem a essência da marca.",
          number: "01"
        },
        {
          title: "Manual da Marca",
          description: "Guia abrangente de aplicação da marca com especificações técnicas, usos corretos e diretrizes de implementação para garantir consistência visual.",
          number: "02"
        },
        {
          title: "Aplicações & Materiais",
          description: "Implementação da identidade em diversos materiais digitais e impressos, garantindo consistência visual em todos os pontos de contato.",
          number: "03"
        },
        {
          title: "Conteúdo Digital",
          description: "Criação de templates para redes sociais, apresentações e materiais de marketing digital otimizados para diferentes plataformas.",
          number: "04"
        }
      ],
      proposal1Price: "R$ 275.000,00",
      proposal2Price: "R$ 412.500,00", 
      completePackagePrice: "R$ 605.000,00",
      projectDescription: "Criamos experiências visuais extraordinárias que conectam ALMA 2026 aos seus públicos através de design inovador e tecnologia de ponta. Este projeto visa estabelecer uma presença marcante no mercado através de uma identidade visual impactante e consistente.",
      timelinePhases: [
        {
          phase: "Pesquisa e Estratégia",
          duration: "2 semanas",
          description: "Análise de mercado, concorrência, briefing detalhado e desenvolvimento da estratégia criativa"
        },
        {
          phase: "Conceituação",
          duration: "1 semana",
          description: "Desenvolvimento de conceitos iniciais, mood boards e direcionamento criativo"
        },
        {
          phase: "Criação Visual",
          duration: "3 semanas",
          description: "Desenvolvimento da identidade visual, logo, tipografia e sistema de cores"
        },
        {
          phase: "Aplicações",
          duration: "2 semanas",
          description: "Criação de materiais, templates e manual da marca"
        },
        {
          phase: "Entrega e Revisões",
          duration: "1 semana",
          description: "Revisões finais, ajustes e entrega completa do projeto"
        }
      ],
      creativeApproach: "Nossa metodologia combina pesquisa de mercado aprofundada, análise de tendências contemporâneas e criatividade estratégica para desenvolver soluções únicas que ressoam autenticamente com o público-alvo e se destacam no mercado.",
      conceptualFramework: "Este projeto para ALMA 2026 visa desenvolver uma identidade visual completa e impactante, estabelecendo uma presença marcante e memorável no mercado através de design estratégico, execução impecável e consistência em todos os pontos de contato da marca.",
      brandPersonality: ["Inovador", "Premium", "Exclusivo", "Tecnológico", "Memorável"],
      designPrinciples: [
        "Simplicidade elegante com impacto visual",
        "Versatilidade de aplicação em diferentes contextos",
        "Consistência visual em todos os pontos de contato",
        "Atemporalidade com toque contemporâneo",
        "Diferenciação estratégica no mercado"
      ],
      contactEmail: "contato@theforce.cc",
      contactPhone: "+55 (11) 98624-3000",
      proposalValidUntil: "30 dias a partir da data de envio",
      paymentTerms: [
        "40% na assinatura do contrato",
        "30% na aprovação do conceito inicial",
        "30% na entrega final e aprovação"
      ],
      deliveryTimeline: "6-9 semanas",
      revisionRounds: "3 rounds de revisão inclusos no projeto"
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  
  console.log('📖 Buscando proposta mock:', slug)
  
  const proposal = mockProposals[slug]
  
  if (!proposal) {
    return NextResponse.json(
      { error: 'Proposal not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(proposal)
}