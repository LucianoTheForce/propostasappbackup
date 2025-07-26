import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const sampleProposals = [
  {
    name: 'Rebranding Corporativo - TechNova',
    client: 'TechNova Solutions',
    value: 85000.00,
    slug: 'rebranding-corporativo-technova',
    status: 'approved',
    version: 3,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Rebranding Corporativo - TechNova",
      clientName: "TechNova Solutions",
      projectDescription: "Projeto completo de rebranding incluindo logo, identidade visual, site e materiais impressos para uma nova era digital.",
      brandPersonality: ["Tech", "Inovador", "Moderno", "Confiável"]
    }
  },
  {
    name: 'Campanha Digital - EcoVerde',
    client: 'EcoVerde Sustentabilidade',
    value: 45000.00,
    slug: 'campanha-digital-ecoverde',
    status: 'sent',
    version: 2,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Campanha Digital - EcoVerde",
      clientName: "EcoVerde Sustentabilidade",
      projectDescription: "Estratégia de marketing digital focada em sustentabilidade e consciência ambiental para um mundo melhor.",
      brandPersonality: ["Sustentável", "Verde", "Consciente", "Natural"]
    }
  },
  {
    name: 'App Mobile - FitLife',
    client: 'FitLife Academia',
    value: 120000.00,
    slug: 'app-mobile-fitlife',
    status: 'viewed',
    version: 1,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "App Mobile - FitLife",
      clientName: "FitLife Academia",
      projectDescription: "Desenvolvimento de aplicativo mobile para gestão de treinos e nutrição, colocando tecnologia a serviço da sua saúde.",
      brandPersonality: ["Fitness", "Energia", "Saúde", "Motivação"]
    }
  },
  {
    name: 'E-commerce - Artesã Brasil',
    client: 'Artesã Brasil',
    value: 75000.00,
    slug: 'ecommerce-artesa-brasil',
    status: 'draft',
    version: 1,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "E-commerce - Artesã Brasil",
      clientName: "Artesã Brasil",
      projectDescription: "Plataforma de e-commerce conectando artesãos brasileiros ao mundo digital, valorizando a cultura nacional.",
      brandPersonality: ["Artesanal", "Brasileiro", "Autêntico", "Cultural"]
    }
  },
  {
    name: 'Identidade Visual - StartupHub',
    client: 'StartupHub Incubadora',
    value: 35000.00,
    slug: 'identidade-visual-startuphub',
    status: 'rejected',
    version: 2,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Identidade Visual - StartupHub",
      clientName: "StartupHub Incubadora",
      projectDescription: "Criação de identidade visual inovadora para incubadora de startups, com foco em inovação e crescimento.",
      brandPersonality: ["Inovador", "Startup", "Crescimento", "Tecnológico"]
    }
  },
  {
    name: 'Portal Educacional - EduTech',
    client: 'EduTech Educação',
    value: 95000.00,
    slug: 'portal-educacional-edutech',
    status: 'approved',
    version: 4,
    created_by: null,
    content_json: {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: "Portal Educacional - EduTech",
      clientName: "EduTech Educação",
      projectDescription: "Plataforma educacional online com recursos interativos e gamificação, representando o futuro da educação digital.",
      brandPersonality: ["Educacional", "Interativo", "Futuro", "Aprendizado"]
    }
  }
]

export async function POST() {
  try {
    // Clear existing proposals first
    const { error: deleteError } = await supabaseAdmin
      .from('proposals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Error clearing proposals:', deleteError)
    }

    // Insert sample proposals
    const { data, error } = await supabaseAdmin
      .from('proposals')
      .insert(sampleProposals)
      .select()

    if (error) {
      console.error('Error inserting proposals:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `${data.length} propostas inseridas com sucesso!`,
      proposals: data 
    })

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST para inserir dados de exemplo',
    endpoint: '/api/seed'
  })
}