import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const getComprehensiveProposalData = (name: string, client: string, value: number, index: number) => ({
  title: "THE FORCE",
  subtitle: "X THE FORCE",
  proposalTitle: name,
  clientName: client,
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
  proposal1Price: `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  proposal2Price: `R$ ${(value * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  completePackagePrice: `R$ ${(value * 2.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  projectDescription: `Criamos experiências visuais extraordinárias que conectam ${client} aos seus públicos através de design inovador e tecnologia de ponta. Este projeto visa estabelecer uma presença marcante no mercado através de uma identidade visual impactante e consistente.`,
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
  conceptualFramework: `Este projeto para ${client} visa desenvolver uma identidade visual completa e impactante, estabelecendo uma presença marcante e memorável no mercado através de design estratégico, execução impecável e consistência em todos os pontos de contato da marca.`,
  brandPersonality: index % 4 === 0 ? ["Inovador", "Tecnológico", "Confiável", "Moderno"] :
                   index % 4 === 1 ? ["Sustentável", "Consciente", "Verde", "Responsável"] :
                   index % 4 === 2 ? ["Energético", "Dinâmico", "Motivador", "Ativo"] :
                   ["Artesanal", "Autêntico", "Cultural", "Brasileiro"],
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
})

const sampleProposals = [
  {
    name: 'Rebranding Corporativo - TechNova Solutions',
    client: 'TechNova Solutions',
    value: 85000.00,
    slug: 'rebranding-corporativo-technova-solutions',
    status: 'approved',
    version: 3,
    created_by: null,
  },
  {
    name: 'Identidade Visual - EcoVerde Sustentabilidade',
    client: 'EcoVerde Sustentabilidade',
    value: 65000.00,
    slug: 'identidade-visual-ecoverde-sustentabilidade',
    status: 'sent',
    version: 2,
    created_by: null,
  },
  {
    name: 'Branding Completo - FitLife Academia Premium',
    client: 'FitLife Academia',
    value: 120000.00,
    slug: 'branding-completo-fitlife-academia-premium',
    status: 'viewed',
    version: 1,
    created_by: null,
  },
  {
    name: 'Identidade Visual - Artesã Brasil Marketplace',
    client: 'Artesã Brasil',
    value: 95000.00,
    slug: 'identidade-visual-artesa-brasil-marketplace',
    status: 'draft',
    version: 1,
    created_by: null,
  },
  {
    name: 'Rebranding - StartupHub Incubadora Digital',
    client: 'StartupHub Incubadora',
    value: 55000.00,
    slug: 'rebranding-startuphub-incubadora-digital',
    status: 'rejected',
    version: 2,
    created_by: null,
  },
  {
    name: 'Identidade Corporativa - EduTech Educação Digital',
    client: 'EduTech Educação',
    value: 110000.00,
    slug: 'identidade-corporativa-edutech-educacao-digital',
    status: 'approved',
    version: 4,
    created_by: null,
  },
  {
    name: 'Visual Identity - ALMA 2026 Club Experience',
    client: 'ALMA 2026',
    value: 275000.00,
    slug: 'visual-identity-alma-2026-club-experience',
    status: 'sent',
    version: 1,
    created_by: null,
  },
  {
    name: 'Branding Premium - RestaurantePlus Gastronomia',
    client: 'RestaurantePlus',
    value: 75000.00,
    slug: 'branding-premium-restauranteplus-gastronomia',
    status: 'viewed',
    version: 1,
    created_by: null,
  }
]

export async function POST() {
  try {
    console.log('🚀 Iniciando processo de seed...')
    
    const supabase = getSupabaseAdmin()
    
    // Primeiro, vamos limpar propostas existentes
    console.log('🧹 Limpando propostas existentes...')
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('❌ Erro ao limpar propostas:', deleteError)
    } else {
      console.log('✅ Propostas antigas removidas')
    }

    // Preparar dados com content_json completo
    const proposalsWithContent = sampleProposals.map((proposal, index) => ({
      ...proposal,
      content_json: getComprehensiveProposalData(proposal.name, proposal.client, proposal.value, index)
    }))

    console.log('📝 Inserindo', proposalsWithContent.length, 'propostas...')

    // Inserir uma por vez para melhor controle de erros
    const insertedProposals = []
    
    for (let i = 0; i < proposalsWithContent.length; i++) {
      const proposal = proposalsWithContent[i]
      console.log(`📄 Inserindo proposta ${i + 1}/${proposalsWithContent.length}: ${proposal.name}`)
      
      try {
        const { data, error } = await supabase
          .from('proposals')
          .insert(proposal)
          .select()
          .single()

        if (error) {
          console.error(`❌ Erro na proposta ${i + 1}:`, error)
          continue
        }

        insertedProposals.push(data)
        console.log(`✅ Proposta ${i + 1} inserida com sucesso`)
        
        // Pequena pausa entre inserções
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (err) {
        console.error(`❌ Erro inesperado na proposta ${i + 1}:`, err)
      }
    }

    console.log(`🎉 Processo concluído! ${insertedProposals.length} propostas inseridas com sucesso`)

    return NextResponse.json({ 
      success: true, 
      message: `${insertedProposals.length} propostas criadas com sucesso!`,
      proposals: insertedProposals.map(p => ({
        id: p.id,
        name: p.name,
        client: p.client,
        value: p.value,
        status: p.status,
        slug: p.slug
      }))
    })

  } catch (error: any) {
    console.error('💥 Erro geral no seed:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message,
      details: 'Erro interno no processo de seed'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Contar propostas existentes
    const { count, error } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({ 
      message: 'Endpoint de seed ativo',
      currentProposals: count,
      instruction: 'Use POST para inserir dados de exemplo',
      endpoint: '/api/seed'
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}