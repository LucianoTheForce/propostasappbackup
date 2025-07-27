import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// UUID padrão para sistema sem autenticação
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001'

async function ensureSystemUser() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Usar a função do banco de dados para criar/verificar usuário sistema
    const { data, error } = await supabase.rpc('create_system_user_if_not_exists')
    
    if (error) {
      console.error('Erro ao executar função do sistema:', error)
      return SYSTEM_USER_ID // Retorna ID mesmo com erro, pois pode estar criado
    }
    
    console.log('✅ Usuário sistema garantido:', data)
    return data || SYSTEM_USER_ID
    
  } catch (error) {
    console.error('Erro na função ensureSystemUser:', error)
    return SYSTEM_USER_ID // Retorna ID por segurança
  }
}

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    )
  }
}

// Função para gerar conteúdo JSON padrão
function generateDefaultContent(name: string, client: string, value: number) {
  return {
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: `Proposta para ${client}`,
        subtitle: name,
        background: '#1a1a1a'
      },
      {
        id: 'overview',
        type: 'text',
        title: 'Visão Geral do Projeto',
        content: `Apresentamos nossa proposta para ${client}, focada em ${name.toLowerCase()}. Esta solução foi desenvolvida para atender às suas necessidades específicas e entregar resultados excepcionais.`,
        layout: 'full'
      },
      {
        id: 'services',
        type: 'services',
        title: 'Serviços Incluídos',
        items: [
          {
            name: 'Consultoria Estratégica',
            description: 'Análise completa e planejamento estratégico personalizado.',
            icon: 'strategy'
          },
          {
            name: 'Design & Desenvolvimento',
            description: 'Criação e implementação de soluções visuais e técnicas.',
            icon: 'design'
          },
          {
            name: 'Gestão de Projeto',
            description: 'Acompanhamento completo desde a concepção até a entrega.',
            icon: 'management'
          }
        ]
      },
      {
        id: 'timeline',
        type: 'timeline',
        title: 'Cronograma do Projeto',
        phases: [
          {
            name: 'Descoberta e Planejamento',
            duration: '2 semanas',
            description: 'Análise de requisitos e definição do escopo.'
          },
          {
            name: 'Design e Prototipagem',
            duration: '3 semanas',
            description: 'Criação de conceitos visuais e protótipos funcionais.'
          },
          {
            name: 'Desenvolvimento',
            duration: '4 semanas',
            description: 'Implementação técnica e desenvolvimento da solução.'
          },
          {
            name: 'Testes e Entrega',
            duration: '1 semana',
            description: 'Testes finais, ajustes e entrega do projeto.'
          }
        ]
      },
      {
        id: 'investment',
        type: 'pricing',
        title: 'Investimento',
        value: value,
        currency: 'BRL',
        description: 'Valor total do projeto incluindo todos os serviços mencionados.',
        payment_terms: 'Parcelamento em até 3x sem juros'
      },
      {
        id: 'next_steps',
        type: 'cta',
        title: 'Próximos Passos',
        content: 'Estamos prontos para iniciar este projeto. Entre em contato para agendar uma reunião e discutir os detalhes.',
        button_text: 'Iniciar Projeto',
        button_link: 'mailto:contato@theforce.cc'
      }
    ],
    metadata: {
      created_at: new Date().toISOString(),
      template_version: '2.0',
      theme: 'alma2026'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando criação de proposta...')
    
    const body = await request.json()
    const { name, client, value, content_json, client_id, status } = body

    console.log('📝 Dados recebidos:', { name, client, value: typeof value, hasContent: !!content_json })

    // Validar dados obrigatórios
    if (!name || !client) {
      return NextResponse.json(
        { error: 'Nome e cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Gerar slug único
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Verificar se slug já existe e gerar único se necessário
    let slug = baseSlug
    let counter = 1
    const supabase = getSupabaseAdmin()
    
    while (true) {
      const { data: existing } = await supabase
        .from('proposals')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (!existing) break
      
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    console.log('🔗 Slug único gerado:', slug)

    // Garantir que existe um usuário sistema
    console.log('👤 Verificando usuário sistema...')
    const systemUserId = await ensureSystemUser()
    
    // Gerar conteúdo padrão se não fornecido
    const finalValue = parseFloat(String(value)) || 0
    const finalContent = content_json || generateDefaultContent(name, client, finalValue)
    
    const proposalData: any = {
      name,
      client,
      client_id: client_id || null,
      value: finalValue,
      slug,
      content_json: finalContent,
      status: status || 'draft',
      version: 1,
      created_by: systemUserId
    }

    console.log('💾 Inserindo proposta no banco...')
    
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposalData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro na inserção:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Tratamento específico para erros comuns
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Já existe uma proposta com este nome. Tente um nome diferente.' },
          { status: 409 }
        )
      }
      
      throw error
    }

    console.log('✅ Proposta criada com sucesso:', {
      id: data.id,
      name: data.name,
      slug: data.slug,
      contentSections: finalContent.sections?.length || 0
    })

    return NextResponse.json({
      ...data,
      url: `/proposals/${data.slug}`,
      edit_url: `/proposals/${data.slug}/edit`
    })
    
  } catch (error: any) {
    console.error('💥 Erro geral na criação:', error)
    
    return NextResponse.json(
      {
        error: 'Falha ao criar proposta',
        details: error.message,
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}