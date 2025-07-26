import { NextRequest, NextResponse } from 'next/server'

// Sistema mock para contornar problemas de banco temporariamente
let mockProposals: any[] = [
  {
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
      projectDescription: "Desenvolvimento completo da identidade visual para ALMA 2026 com foco em inovação e experiência de clube premium.",
      brandPersonality: ["Inovador", "Premium", "Exclusivo", "Tecnológico"]
    }
  },
  {
    id: '2', 
    name: 'Rebranding Corporativo - TechNova Solutions',
    client: 'TechNova Solutions',
    value: 120000,
    slug: 'rebranding-corporativo-technova-solutions',
    status: 'approved',
    version: 2,
    created_at: '2025-01-10T14:30:00Z',
    updated_at: '2025-01-12T16:45:00Z',
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE", 
      proposalTitle: "Rebranding Corporativo - TechNova Solutions",
      clientName: "TechNova Solutions",
      projectDescription: "Modernização completa da identidade corporativa com foco em tecnologia e inovação.",
      brandPersonality: ["Tecnológico", "Confiável", "Inovador", "Corporativo"]
    }
  },
  {
    id: '3',
    name: 'Identidade Visual - EcoVerde Sustentabilidade', 
    client: 'EcoVerde',
    value: 85000,
    slug: 'identidade-visual-ecoverde-sustentabilidade',
    status: 'viewed',
    version: 1,
    created_at: '2025-01-08T09:15:00Z',
    updated_at: '2025-01-08T09:15:00Z',
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Identidade Visual - EcoVerde Sustentabilidade",
      clientName: "EcoVerde",
      projectDescription: "Criação de identidade visual focada em sustentabilidade e responsabilidade ambiental.",
      brandPersonality: ["Sustentável", "Verde", "Responsável", "Natural"]
    }
  }
]

export async function GET() {
  console.log('📖 Retornando propostas mock...')
  
  return NextResponse.json(mockProposals.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ))
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Criando proposta mock...')
    
    const body = await request.json()
    const { name, client, value, content_json } = body

    if (!name || !client) {
      return NextResponse.json(
        { error: 'Nome e cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Gerar slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Criar nova proposta mock
    const newProposal = {
      id: String(mockProposals.length + 1),
      name,
      client,
      value: parseFloat(String(value)) || 0,
      slug,
      status: 'draft',
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_json: content_json || {
        title: "THE FORCE",
        subtitle: "X THE FORCE",
        proposalTitle: name,
        clientName: client,
        projectDescription: `Projeto personalizado para ${client}`,
        brandPersonality: ["Inovador", "Criativo", "Impactante", "Memorável"]
      }
    }

    // Adicionar à lista mock
    mockProposals.push(newProposal)

    console.log('✅ Proposta mock criada:', newProposal.name)

    return NextResponse.json(newProposal)
    
  } catch (error: any) {
    console.error('❌ Erro ao criar proposta mock:', error)
    
    return NextResponse.json(
      { error: 'Failed to create proposal', details: error.message },
      { status: 500 }
    )
  }
}