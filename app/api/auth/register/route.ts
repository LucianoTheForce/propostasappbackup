import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Criar cliente Supabase com service role para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validar campos
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se é o primeiro usuário
    const { count } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })

    const isFirstUser = count === 0

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      
      // Tratar erros específicos
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Erro ao criar conta. Tente novamente.' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 400 }
      )
    }

    // Criar registro na tabela users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name,
        role: isFirstUser ? 'admin' : 'user', // Primeiro usuário é admin
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Erro ao criar registro na tabela users:', dbError)
      
      // Se falhou ao criar o registro, deletar o usuário do Auth
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json(
        { error: 'Erro ao criar perfil de usuário' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: isFirstUser 
          ? 'Conta admin criada com sucesso!' 
          : 'Conta criada com sucesso!',
        isAdmin: isFirstUser
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}