// Debug script para verificar configuração do Supabase
// Execute com: node debug-auth.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function debugAuth() {
  console.log('🔍 Debug do Sistema de Autenticação\n')
  
  // Verificar variáveis de ambiente
  console.log('📋 Variáveis de Ambiente:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Definida' : '❌ Não definida')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Definida' : '❌ Não definida')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Definida' : '❌ Não definida')
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Definida' : '❌ Não definida')
  console.log('')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Configure as variáveis de ambiente no .env.local primeiro!')
    return
  }

  // Testar conexão com Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    console.log('🔗 Testando conexão com Supabase...')
    
    // Verificar se as tabelas existem
    console.log('\n📋 Verificando tabelas:')
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (usersError) {
      console.log('❌ Tabela users:', usersError.message)
      console.log('   💡 Execute o schema SQL no Supabase Dashboard!')
    } else {
      console.log('✅ Tabela users: OK')
    }

    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select('count', { count: 'exact', head: true })
    
    if (proposalsError) {
      console.log('❌ Tabela proposals:', proposalsError.message)
    } else {
      console.log('✅ Tabela proposals: OK')
    }

    // Listar usuários existentes
    console.log('\n👥 Usuários na tabela users:')
    const { data: allUsers, error: listError } = await supabase
      .from('users')
      .select('id, email, name, role')
    
    if (listError) {
      console.log('❌ Erro ao listar usuários:', listError.message)
    } else if (allUsers.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado na tabela users')
      console.log('   💡 Crie um usuário no Supabase Auth primeiro!')
    } else {
      allUsers.forEach(user => {
        console.log(`   • ${user.email} (${user.role}) - ID: ${user.id}`)
      })
    }

    // Listar usuários do Supabase Auth
    console.log('\n🔐 Usuários no Supabase Auth:')
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.log('❌ Erro ao listar usuários do Auth:', authError.message)
    } else if (authUsers.users.length === 0) {
      console.log('⚠️  Nenhum usuário no Supabase Auth')
      console.log('   💡 Crie um usuário no painel do Supabase!')
    } else {
      authUsers.users.forEach(user => {
        console.log(`   • ${user.email} - ID: ${user.id}`)
      })
    }

  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }

  console.log('\n📝 Próximos passos:')
  console.log('1. Configure as variáveis de ambiente no .env.local')
  console.log('2. Execute o SQL schema no Supabase Dashboard')
  console.log('3. Crie um usuário no Supabase Auth')
  console.log('4. O sistema criará automaticamente o registro na tabela users')
}

debugAuth()