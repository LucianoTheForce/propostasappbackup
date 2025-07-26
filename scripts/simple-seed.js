const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jbtvjbnyxudvuufhtlkc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidHZqYm55eHVkdnV1Zmh0bGtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ2MDY1MiwiZXhwIjoyMDY5MDM2NjUyfQ.oB1CEY11z646uQyqOW1Pp7Lhme_-zt5BMSCuHiHBLKw'

const supabase = createClient(supabaseUrl, supabaseKey)

// Simple proposals without user dependencies
const proposals = [
  {
    name: 'Rebranding Corporativo - TechNova',
    client: 'TechNova Solutions',
    value: 85000.00,
    slug: 'rebranding-corporativo-technova',
    status: 'approved',
    version: 3,
    content_json: {
      hero: { title: 'Rebranding Corporativo TechNova', subtitle: 'Nova identidade para nova era digital' },
      description: 'Projeto completo de rebranding incluindo logo, identidade visual, site e materiais impressos.'
    }
  },
  {
    name: 'Campanha Digital - EcoVerde',
    client: 'EcoVerde Sustentabilidade',
    value: 45000.00,
    slug: 'campanha-digital-ecoverde',
    status: 'sent',
    version: 2,
    content_json: {
      hero: { title: 'Campanha Digital EcoVerde', subtitle: 'Comunicação sustentável para um mundo melhor' },
      description: 'Estratégia de marketing digital focada em sustentabilidade e consciência ambiental.'
    }
  },
  {
    name: 'App Mobile - FitLife',
    client: 'FitLife Academia',
    value: 120000.00,
    slug: 'app-mobile-fitlife',
    status: 'viewed',
    version: 1,
    content_json: {
      hero: { title: 'App Mobile FitLife', subtitle: 'Tecnologia a serviço da sua saúde' },
      description: 'Desenvolvimento de aplicativo mobile para gestão de treinos e nutrição.'
    }
  },
  {
    name: 'E-commerce - Artesã Brasil',
    client: 'Artesã Brasil',
    value: 75000.00,
    slug: 'ecommerce-artesa-brasil',
    status: 'draft',
    version: 1,
    content_json: {
      hero: { title: 'E-commerce Artesã Brasil', subtitle: 'Conectando artesãos ao mundo digital' },
      description: 'Plataforma de e-commerce para venda de artesanatos brasileiros.'
    }
  },
  {
    name: 'Identidade Visual - StartupHub',
    client: 'StartupHub Incubadora',
    value: 35000.00,
    slug: 'identidade-visual-startuphub',
    status: 'rejected',
    version: 2,
    content_json: {
      hero: { title: 'Identidade Visual StartupHub', subtitle: 'Inovação visual para inovadores' },
      description: 'Criação de identidade visual para incubadora de startups.'
    }
  },
  {
    name: 'Portal Educacional - EduTech',
    client: 'EduTech Educação',
    value: 95000.00,
    slug: 'portal-educacional-edutech',
    status: 'approved',
    version: 4,
    content_json: {
      hero: { title: 'Portal Educacional EduTech', subtitle: 'O futuro da educação é digital' },
      description: 'Plataforma educacional online com recursos interativos e gamificação.'
    }
  }
]

async function insertProposals() {
  console.log('🌱 Inserindo propostas de exemplo...')
  
  try {
    // Clear existing
    await supabase.from('proposals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Insert new
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposals)
      .select()

    if (error) {
      console.error('❌ Erro:', error)
      return
    }

    console.log('✅ Sucesso! Propostas inseridas:')
    data.forEach(p => console.log(`   • ${p.name} (${p.status}) - R$ ${p.value.toLocaleString('pt-BR')}`))
    
    const total = data.reduce((sum, p) => sum + p.value, 0)
    console.log(`\n💰 Valor total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

insertProposals()