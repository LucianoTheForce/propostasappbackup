import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// UUID padrão para sistema sem autenticação
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001'

async function ensureSystemUser() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Verificar se o usuário sistema existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', SYSTEM_USER_ID)
      .single()
    
    if (existingUser) {
      return SYSTEM_USER_ID
    }

    // Criar usuário sistema se não existir
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        id: SYSTEM_USER_ID,
        email: 'system@theforce.cc',
        name: 'Sistema THE FORCE',
        role: 'admin'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário sistema:', error)
      // Se falhar, retorna null para tentar inserção sem created_by
      return null
    }

    console.log('✅ Usuário sistema criado:', newUser)
    return SYSTEM_USER_ID
    
  } catch (error) {
    console.error('Erro na função ensureSystemUser:', error)
    return null
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

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando criação de proposta...')
    
    const body = await request.json()
    const { name, client, value, content_json } = body

    console.log('📝 Dados recebidos:', { name, client, value: typeof value })

    // Validar dados obrigatórios
    if (!name || !client) {
      return NextResponse.json(
        { error: 'Nome e cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    console.log('🔗 Slug gerado:', slug)

    // Garantir que existe um usuário sistema
    console.log('👤 Verificando usuário sistema...')
    const systemUserId = await ensureSystemUser()
    
    const proposalData: any = {
      name,
      client,
      value: parseFloat(String(value)) || 0,
      slug,
      content_json: content_json || {},
      status: 'draft',
      version: 1
    }

    // Adicionar created_by se conseguimos criar/encontrar usuário sistema
    if (systemUserId) {
      proposalData.created_by = systemUserId
      console.log('✅ Usando usuário sistema:', systemUserId)
    } else {
      console.log('⚠️ Tentando inserção sem created_by')
    }

    console.log('💾 Inserindo proposta no banco...')
    
    const { data, error } = await getSupabaseAdmin()
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
      throw error
    }

    console.log('✅ Proposta criada com sucesso:', {
      id: data.id,
      name: data.name,
      slug: data.slug
    })

    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('💥 Erro geral na criação:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create proposal',
        details: error.message,
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}