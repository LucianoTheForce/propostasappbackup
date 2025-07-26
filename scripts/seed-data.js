const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jbtvjbnyxudvuufhtlkc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidHZqYm55eHVkdnV1Zmh0bGtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ2MDY1MiwiZXhwIjoyMDY5MDM2NjUyfQ.oB1CEY11z646uQyqOW1Pp7Lhme_-zt5BMSCuHiHBLKw'

const supabase = createClient(supabaseUrl, supabaseKey)

// Create admin user first
const adminUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'admin@theforce.cc',
  name: 'Admin Force',
  role: 'admin'
}

const sampleProposals = [
  {
    name: 'Rebranding Corporativo - TechNova',
    client: 'TechNova Solutions',
    value: 85000.00,
    slug: 'rebranding-corporativo-technova',
    status: 'approved',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'Rebranding Corporativo TechNova',
          subtitle: 'Uma nova identidade para uma nova era digital'
        },
        {
          type: 'text',
          content: '<h2>Sobre o Projeto</h2><p>A TechNova Solutions busca renovar sua imagem corporativa para refletir sua evolução como líder em soluções tecnológicas. Este projeto abrange desde a criação de uma nova identidade visual até a implementação em todos os pontos de contato da marca.</p><h3>Entregáveis Principais:</h3><ul><li>Nova identidade visual e logo</li><li>Manual da marca completo</li><li>Website responsivo</li><li>Materiais impressos</li><li>Apresentação corporativa</li></ul>'
        },
        {
          type: 'timeline',
          phases: [
            { name: 'Pesquisa e Briefing', duration: '2 semanas', status: 'completed' },
            { name: 'Criação da Identidade', duration: '3 semanas', status: 'completed' },
            { name: 'Desenvolvimento Web', duration: '4 semanas', status: 'in_progress' },
            { name: 'Materiais Impressos', duration: '2 semanas', status: 'pending' }
          ]
        }
      ]
    },
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    version: 3
  },
  {
    name: 'Campanha Digital - EcoVerde',
    client: 'EcoVerde Sustentabilidade',
    value: 45000.00,
    slug: 'campanha-digital-ecoverde',
    status: 'sent',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'Campanha Digital EcoVerde',
          subtitle: 'Comunicação sustentável para um mundo melhor'
        },
        {
          type: 'text',
          content: '<h2>Estratégia Digital</h2><p>Desenvolvimento de uma campanha digital integrada para posicionar a EcoVerde como referência em sustentabilidade empresarial.</p><h3>Canais de Comunicação:</h3><ul><li>Redes sociais (Instagram, LinkedIn, Facebook)</li><li>Blog corporativo</li><li>Newsletter mensal</li><li>Webinars educacionais</li><li>Partnerships com influencers</li></ul>'
        },
        {
          type: 'metrics',
          goals: [
            { metric: 'Alcance', target: '500K pessoas/mês' },
            { metric: 'Engajamento', target: '5% taxa de interação' },
            { metric: 'Leads', target: '200 leads qualificados/mês' },
            { metric: 'Conversão', target: '15% taxa de conversão' }
          ]
        }
      ]
    },
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2
  },
  {
    name: 'App Mobile - FitLife',
    client: 'FitLife Academia',
    value: 120000.00,
    slug: 'app-mobile-fitlife',
    status: 'viewed',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'App Mobile FitLife',
          subtitle: 'Tecnologia a serviço da sua saúde'
        },
        {
          type: 'text',
          content: '<h2>Funcionalidades do App</h2><p>Aplicativo completo para iOS e Android com foco na experiência do usuário e gamificação do fitness.</p><h3>Features Principais:</h3><ul><li>Planos de treino personalizados</li><li>Acompanhamento nutricional</li><li>Social fitness e desafios</li><li>Integração com wearables</li><li>Coach virtual com IA</li><li>Marketplace de produtos</li></ul>'
        },
        {
          type: 'tech',
          stack: [
            { name: 'React Native', purpose: 'Frontend mobile' },
            { name: 'Node.js', purpose: 'Backend API' },
            { name: 'PostgreSQL', purpose: 'Database' },
            { name: 'Redis', purpose: 'Cache' },
            { name: 'AWS', purpose: 'Cloud infrastructure' }
          ]
        }
      ]
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    version: 1
  },
  {
    name: 'E-commerce - Artesã Brasil',
    client: 'Artesã Brasil',
    value: 75000.00,
    slug: 'ecommerce-artesa-brasil',
    status: 'draft',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'E-commerce Artesã Brasil',
          subtitle: 'Conectando artesãos ao mundo digital'
        },
        {
          type: 'text',
          content: '<h2>Plataforma de Vendas</h2><p>Desenvolvimento de marketplace especializado em artesanato brasileiro, conectando produtores locais com consumidores nacionais e internacionais.</p><h3>Recursos da Plataforma:</h3><ul><li>Cadastro de artesãos e produtos</li><li>Sistema de pagamentos integrado</li><li>Logística e rastreamento</li><li>Avaliações e reviews</li><li>Blog cultural</li><li>Sistema de afiliados</li></ul>'
        }
      ]
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    version: 1
  },
  {
    name: 'Identidade Visual - StartupHub',
    client: 'StartupHub Incubadora',
    value: 35000.00,
    slug: 'identidade-visual-startuphub',
    status: 'rejected',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'Identidade Visual StartupHub',
          subtitle: 'Inovação visual para inovadores'
        },
        {
          type: 'text',
          content: '<h2>Conceito Criativo</h2><p>Desenvolvimento de identidade visual moderna e tech-forward para incubadora de startups, refletindo inovação e crescimento.</p><h3>Deliverables:</h3><ul><li>Logo e variações</li><li>Paleta de cores</li><li>Tipografia corporativa</li><li>Papelaria institucional</li><li>Templates de apresentação</li><li>Guia de aplicação da marca</li></ul>'
        }
      ]
    },
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2
  },
  {
    name: 'Portal Educacional - EduTech',
    client: 'EduTech Educação',
    value: 95000.00,
    slug: 'portal-educacional-edutech',
    status: 'approved',
    content_json: {
      sections: [
        {
          type: 'hero',
          title: 'Portal Educacional EduTech',
          subtitle: 'O futuro da educação é digital'
        },
        {
          type: 'text',
          content: '<h2>Plataforma Educacional</h2><p>Desenvolvimento de portal educacional completo com foco na experiência do aluno e ferramentas avançadas para educadores.</p><h3>Módulos Principais:</h3><ul><li>LMS (Learning Management System)</li><li>Videoconferências integradas</li><li>Gamificação e badges</li><li>Analytics de aprendizado</li><li>Marketplace de cursos</li><li>Comunidade de estudantes</li></ul>'
        },
        {
          type: 'users',
          personas: [
            { type: 'Estudantes', needs: 'Interface intuitiva, progresso claro' },
            { type: 'Professores', needs: 'Ferramentas de criação, analytics' },
            { type: 'Administradores', needs: 'Gestão completa, relatórios' }
          ]
        }
      ]
    },
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    version: 4
  }
]

async function seedDatabase() {
  console.log('🌱 Iniciando seeding do banco de dados...')
  
  try {
    // First, create the admin user in users table
    console.log('👤 Criando usuário admin...')
    const { error: userError } = await supabase
      .from('users')
      .upsert([adminUser])
    
    if (userError) {
      console.error('Erro ao criar usuário admin:', userError)
      // Continue anyway, we'll remove the created_by constraint
    }
    
    // Clear existing proposals
    console.log('🗑️  Limpando propostas existentes...')
    const { error: deleteError } = await supabase
      .from('proposals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error('Erro ao limpar propostas:', deleteError)
    }

    // Insert sample proposals
    console.log('📝 Inserindo propostas de exemplo...')
    const { data, error } = await supabase
      .from('proposals')
      .insert(sampleProposals)
      .select()

    if (error) {
      console.error('Erro ao inserir dados:', error)
      return
    }

    console.log('✅ Seeding concluído com sucesso!')
    console.log(`📊 ${data.length} propostas inseridas:`)
    
    data.forEach(proposal => {
      console.log(`   • ${proposal.name} (${proposal.status}) - R$ ${proposal.value.toLocaleString('pt-BR')}`)
    })

    // Show statistics
    const stats = {
      total: data.length,
      approved: data.filter(p => p.status === 'approved').length,
      sent: data.filter(p => p.status === 'sent').length,
      draft: data.filter(p => p.status === 'draft').length,
      viewed: data.filter(p => p.status === 'viewed').length,
      rejected: data.filter(p => p.status === 'rejected').length,
      totalValue: data.reduce((sum, p) => sum + p.value, 0)
    }

    console.log('\n📈 Estatísticas:')
    console.log(`   Total de propostas: ${stats.total}`)
    console.log(`   Aprovadas: ${stats.approved}`)
    console.log(`   Enviadas: ${stats.sent}`)
    console.log(`   Rascunhos: ${stats.draft}`)
    console.log(`   Visualizadas: ${stats.viewed}`)
    console.log(`   Rejeitadas: ${stats.rejected}`)
    console.log(`   Valor total: R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)

  } catch (error) {
    console.error('❌ Erro durante o seeding:', error)
  }
}

// Run the seeding
seedDatabase()