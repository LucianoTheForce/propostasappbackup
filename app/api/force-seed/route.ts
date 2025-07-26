import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Força a criação de propostas removendo todas as políticas e constraints
export async function POST() {
  try {
    console.log('🚀 FORCE SEED: Iniciando processo forçado de seed...')
    
    const supabase = getSupabaseAdmin()
    
    // Dados simplificados para garantir inserção
    const testProposals = [
      {
        name: 'Teste ALMA 2026 - Identidade Visual Completa',
        client: 'ALMA 2026',
        value: 275000,
        slug: 'teste-alma-2026-identidade-visual-completa',
        status: 'sent',
        version: 1,
        created_by: null,
        content_json: {
          title: "THE FORCE",
          subtitle: "X THE FORCE",
          proposalTitle: "Teste ALMA 2026 - Identidade Visual Completa",
          clientName: "ALMA 2026",
          projectDescription: "Desenvolvimento completo da identidade visual para ALMA 2026 com foco em inovação e impacto visual."
        }
      },
      {
        name: 'Branding TechNova - Solução Corporativa',
        client: 'TechNova Solutions',
        value: 120000,
        slug: 'branding-technova-solucao-corporativa',
        status: 'approved',
        version: 2,
        created_by: null,
        content_json: {
          title: "THE FORCE",
          subtitle: "X THE FORCE", 
          proposalTitle: "Branding TechNova - Solução Corporativa",
          clientName: "TechNova Solutions",
          projectDescription: "Rebranding completo para TechNova com foco em modernização e posicionamento digital."
        }
      },
      {
        name: 'Identidade EcoVerde - Sustentabilidade',
        client: 'EcoVerde',
        value: 85000,
        slug: 'identidade-ecoverde-sustentabilidade', 
        status: 'viewed',
        version: 1,
        created_by: null,
        content_json: {
          title: "THE FORCE",
          subtitle: "X THE FORCE",
          proposalTitle: "Identidade EcoVerde - Sustentabilidade",
          clientName: "EcoVerde",
          projectDescription: "Criação de identidade visual focada em sustentabilidade e responsabilidade ambiental."
        }
      }
    ]

    console.log('🧹 Limpando tabela de propostas...')
    
    // Tentar remover propostas existentes
    try {
      await supabase.from('proposals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      console.log('✅ Propostas antigas removidas')
    } catch (deleteError) {
      console.log('⚠️ Erro ao limpar propostas (continuando mesmo assim):', deleteError)
    }

    console.log('📝 Inserindo propostas de teste...')
    
    const results = []
    
    // Inserir uma por vez com logs detalhados
    for (let i = 0; i < testProposals.length; i++) {
      const proposal = testProposals[i]
      console.log(`\n📄 [${i + 1}/${testProposals.length}] Inserindo: ${proposal.name}`)
      
      try {
        const { data, error } = await supabase
          .from('proposals')
          .insert(proposal)
          .select('id, name, client, status, slug')
          .single()

        if (error) {
          console.error(`❌ Erro específico na proposta ${i + 1}:`, {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          
          results.push({
            success: false,
            proposal: proposal.name,
            error: error.message
          })
        } else {
          console.log(`✅ Sucesso na proposta ${i + 1}:`, data)
          results.push({
            success: true,
            proposal: data.name,
            id: data.id,
            slug: data.slug
          })
        }
        
        // Pausa entre inserções
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (unexpectedError: any) {
        console.error(`💥 Erro inesperado na proposta ${i + 1}:`, unexpectedError)
        results.push({
          success: false,
          proposal: proposal.name,
          error: unexpectedError.message
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    console.log(`\n🎯 RESULTADO FINAL:`)
    console.log(`✅ Sucessos: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    console.log(`📊 Taxa de sucesso: ${(successCount / results.length * 100).toFixed(1)}%`)

    return NextResponse.json({
      success: successCount > 0,
      message: `Force seed concluído: ${successCount} sucessos, ${errorCount} erros`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount,
        successRate: `${(successCount / results.length * 100).toFixed(1)}%`
      }
    })

  } catch (error: any) {
    console.error('💥 ERRO CRÍTICO no force seed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro crítico no processo de force seed',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Verificar propostas existentes
    const { data, error, count } = await supabase
      .from('proposals')
      .select('id, name, client, status', { count: 'exact' })
      .limit(10)

    if (error) {
      return NextResponse.json({
        error: `Erro ao verificar propostas: ${error.message}`
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Force Seed API - Endpoint para forçar criação de propostas',
      currentProposals: count,
      sampleProposals: data?.slice(0, 5) || [],
      instruction: 'Use POST /api/force-seed para forçar inserção',
      status: 'ready'
    })
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}