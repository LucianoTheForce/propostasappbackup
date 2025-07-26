import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Testa inserção direta usando SQL raw se necessário
export async function POST() {
  try {
    console.log('🚀 TESTE DIRETO: Tentando inserção direta...')
    
    const supabase = getSupabaseAdmin()
    
    // Primeiro tentar criar usuário via SQL direto
    console.log('👤 Tentando criar usuário via SQL...')
    
    const { data: sqlUser, error: sqlUserError } = await supabase.rpc('create_system_user_if_not_exists')
    
    if (sqlUserError) {
      console.log('⚠️ Função SQL não existe, tentando inserção padrão...')
    }
    
    // Teste de inserção bem simples
    const testProposal = {
      name: 'TESTE DIRETO - Proposta Simples',
      client: 'Cliente Direto',
      value: 50000,
      slug: 'teste-direto-proposta-simples',
      status: 'draft',
      version: 1,
      content_json: {
        title: "THE FORCE",
        proposalTitle: "TESTE DIRETO - Proposta Simples"
      }
    }

    console.log('💾 Tentando inserção sem created_by...')
    
    const { data, error } = await supabase
      .from('proposals')
      .insert(testProposal)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro na inserção direta:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Se falhar por created_by, tentar com um UUID qualquer
      if (error.message.includes('created_by')) {
        console.log('🔄 Tentando com UUID dummy...')
        
        const testWithDummy = {
          ...testProposal,
          created_by: '00000000-0000-0000-0000-000000000001'
        }
        
        const { data: dataWithDummy, error: errorWithDummy } = await supabase
          .from('proposals')
          .insert(testWithDummy)
          .select()
          .single()
          
        if (errorWithDummy) {
          console.error('❌ Falhou mesmo com UUID dummy:', errorWithDummy)
          
          return NextResponse.json({
            success: false,
            error: 'Falha na inserção',
            originalError: error.message,
            dummyError: errorWithDummy.message,
            suggestions: [
              'Verificar se as políticas RLS estão corretas',
              'Verificar se a constraint de created_by permite NULL',
              'Verificar se existe a tabela users com o ID necessário'
            ]
          })
        }
        
        console.log('✅ Sucesso com UUID dummy!')
        return NextResponse.json({
          success: true,
          method: 'dummy_uuid',
          data: dataWithDummy,
          message: 'Proposta criada com UUID dummy'
        })
      }
      
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details,
        code: error.code
      })
    }

    console.log('✅ Sucesso na inserção direta!')
    
    return NextResponse.json({
      success: true,
      method: 'direct_insert',
      data,
      message: 'Proposta criada diretamente sem created_by'
    })

  } catch (error: any) {
    console.error('💥 Erro crítico no teste direto:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro crítico',
      message: error.message,
      stack: error.stack
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Direct API - Para testar inserção direta de propostas',
    endpoint: 'POST /api/test-direct',
    purpose: 'Debugging database constraints and policies'
  })
}