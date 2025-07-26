'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Sparkles, Building2, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const projectTypes = [
  { value: 'branding', label: 'Branding Completo', baseValue: 85000 },
  { value: 'rebranding', label: 'Rebranding Corporativo', baseValue: 95000 },
  { value: 'identity', label: 'Identidade Visual', baseValue: 65000 },
  { value: 'digital', label: 'Experiência Digital', baseValue: 120000 },
  { value: 'space', label: 'Design de Espaço', baseValue: 150000 },
  { value: 'complete', label: 'Pacote Completo', baseValue: 200000 }
]

const clientSizes = [
  { value: 'startup', label: 'Startup', multiplier: 0.7 },
  { value: 'small', label: 'Pequena Empresa', multiplier: 0.8 },
  { value: 'medium', label: 'Média Empresa', multiplier: 1.0 },
  { value: 'large', label: 'Grande Empresa', multiplier: 1.3 },
  { value: 'enterprise', label: 'Corporação', multiplier: 1.6 }
]

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    projectType: '',
    clientSize: '',
    value: '',
    description: '',
    deliveryTimeline: '6-8 semanas',
    urgency: 'normal'
  })

  const [estimatedValue, setEstimatedValue] = useState(0)

  const calculateEstimatedValue = (projectType: string, clientSize: string) => {
    const type = projectTypes.find(t => t.value === projectType)
    const size = clientSizes.find(s => s.value === clientSize)
    
    if (type && size) {
      return Math.round(type.baseValue * size.multiplier)
    }
    return 0
  }

  const updateEstimatedValue = (projectType: string, clientSize: string) => {
    const estimated = calculateEstimatedValue(projectType, clientSize)
    setEstimatedValue(estimated)
    setFormData(prev => ({ ...prev, value: estimated.toString() }))
  }

  const generateProposalName = (client: string, projectType: string) => {
    const type = projectTypes.find(t => t.value === projectType)
    if (!client || !type) return ''
    return `${type.label} - ${client}`
  }

  const createComprehensiveContent = () => {
    const type = projectTypes.find(t => t.value === formData.projectType)
    const client = formData.client
    const value = parseFloat(formData.value) || 0
    
    const scopeByType = {
      branding: [
        "Desenvolvimento completo da identidade visual",
        "Criação de logo e sistema de marca",
        "Manual da marca com diretrizes",
        "Aplicações em materiais diversos",
        "Estratégia de comunicação visual"
      ],
      rebranding: [
        "Redesign completo da identidade atual",
        "Análise da marca existente",
        "Nova proposta visual e conceitual",
        "Migração gradual da identidade",
        "Implementação em todos os materiais"
      ],
      identity: [
        "Criação de identidade visual única",
        "Logo, tipografia e paleta de cores",
        "Elementos visuais complementares",
        "Aplicações básicas da marca",
        "Diretrizes de uso"
      ],
      digital: [
        "Design de experiência digital",
        "Interface e user experience",
        "Identidade visual digital",
        "Templates e componentes",
        "Otimização para diferentes devices"
      ],
      space: [
        "Design de ambientes comerciais",
        "Sinalização e wayfinding",
        "Conceito espacial integrado",
        "Projeto técnico e executivo",
        "Acompanhamento da execução"
      ],
      complete: [
        "Identidade visual completa",
        "Experiência digital integrada",
        "Design de espaços físicos",
        "Materiais de comunicação",
        "Estratégia 360° da marca"
      ]
    }

    return {
      title: "THE FORCE",
      subtitle: "X THE FORCE",
      proposalTitle: formData.name || generateProposalName(client, formData.projectType),
      clientName: client,
      projectScope: scopeByType[formData.projectType as keyof typeof scopeByType] || scopeByType.branding,
      deliverablesList: [
        {
          title: "Estratégia e Conceito",
          description: "Desenvolvimento da estratégia criativa e conceituação da marca, incluindo pesquisa de mercado e análise competitiva.",
          number: "01"
        },
        {
          title: "Identidade Visual",
          description: "Criação completa da identidade visual incluindo logo, tipografia, paleta de cores e elementos gráficos distintivos.",
          number: "02"
        },
        {
          title: "Aplicações e Materiais",
          description: "Desenvolvimento de todas as aplicações necessárias, desde materiais impressos até versões digitais.",
          number: "03"
        },
        {
          title: "Manual e Diretrizes",
          description: "Entrega de manual completo com todas as especificações técnicas e diretrizes de uso da marca.",
          number: "04"
        }
      ],
      proposal1Price: `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      proposal2Price: `R$ ${(value * 1.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      completePackagePrice: `R$ ${(value * 1.8).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      projectDescription: formData.description || `Projeto de ${type?.label.toLowerCase()} para ${client}, focado em criar uma identidade visual impactante e memorável que conecte a marca ao seu público-alvo de forma autêntica e diferenciada no mercado.`,
      timelinePhases: [
        {
          phase: "Descoberta e Estratégia",
          duration: "1-2 semanas",
          description: "Imersão na marca, análise de mercado e desenvolvimento da estratégia criativa"
        },
        {
          phase: "Conceituação",
          duration: "1 semana",
          description: "Desenvolvimento de conceitos iniciais e direcionamento visual"
        },
        {
          phase: "Criação",
          duration: "2-3 semanas",
          description: "Desenvolvimento da identidade visual e elementos gráficos"
        },
        {
          phase: "Aplicações",
          duration: "1-2 semanas",
          description: "Criação de materiais e aplicações da marca"
        },
        {
          phase: "Finalização",
          duration: "1 semana",
          description: "Revisões, ajustes finais e entrega completa"
        }
      ],
      creativeApproach: "Nossa abordagem combina pesquisa estratégica, criatividade inovadora e execução técnica impecável para desenvolver soluções visuais que não apenas representam a marca, mas a elevam a um novo patamar de reconhecimento e conexão emocional.",
      conceptualFramework: `Este projeto visa estabelecer ${client} como referência em seu segmento através de uma identidade visual única, memorável e estrategicamente posicionada, garantindo consistência e impacto em todos os pontos de contato com o público.`,
      brandPersonality: ["Inovador", "Autêntico", "Impactante", "Memorável", "Estratégico"],
      designPrinciples: [
        "Simplicidade com impacto",
        "Consistência visual",
        "Flexibilidade de aplicação",
        "Atemporalidade moderna",
        "Diferenciação estratégica"
      ],
      contactEmail: "contato@theforce.cc",
      contactPhone: "+55 (11) 98624-3000",
      proposalValidUntil: "30 dias a partir da data de envio",
      paymentTerms: [
        "40% na assinatura do contrato",
        "35% na aprovação do conceito",
        "25% na entrega final"
      ],
      deliveryTimeline: formData.deliveryTimeline,
      revisionRounds: "3 rounds de revisão inclusos"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const proposalName = formData.name || generateProposalName(formData.client, formData.projectType)
      
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: proposalName,
          client: formData.client,
          value: parseFloat(formData.value) || 0,
          content_json: createComprehensiveContent()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create proposal')
      }

      const proposal = await response.json()
      console.log('✅ Proposta criada:', proposal)
      
      // Redirecionar para visualizar a proposta
      router.push(`/proposals/${proposal.slug}`)
      
    } catch (error: any) {
      console.error('❌ Erro ao criar proposta:', error)
      alert(`Erro ao criar proposta: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Auto-calcular valor estimado quando mudar tipo ou tamanho
      if (name === 'projectType' || name === 'clientSize') {
        const projectType = name === 'projectType' ? value : prev.projectType
        const clientSize = name === 'clientSize' ? value : prev.clientSize
        
        if (projectType && clientSize) {
          updateEstimatedValue(projectType, clientSize)
        }
      }
      
      // Auto-gerar nome da proposta
      if (name === 'client' || name === 'projectType') {
        const client = name === 'client' ? value : prev.client
        const projectType = name === 'projectType' ? value : prev.projectType
        
        if (client && projectType && !prev.name) {
          newData.name = generateProposalName(client, projectType)
        }
      }
      
      return newData
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Criar Nova Proposta
            </h1>
            <p className="text-sm text-white/60">Configure os detalhes da sua proposta personalizada</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Nome do Cliente *</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => handleChange('client', e.target.value)}
                      placeholder="ex: ALMA 2026, TechNova Solutions"
                      className="bg-white/5 border-white/10"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSize">Porte da Empresa *</Label>
                    <Select onValueChange={(value) => handleChange('clientSize', value)} required>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tipo de Projeto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  Tipo de Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Tipo de Serviço *</Label>
                  <Select onValueChange={(value) => handleChange('projectType', value)} required>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Selecione o tipo de projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - R$ {type.baseValue.toLocaleString('pt-BR')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Proposta</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nome será gerado automaticamente"
                    className="bg-white/5 border-white/10"
                  />
                  <p className="text-xs text-white/60">
                    Deixe vazio para gerar automaticamente baseado no cliente e tipo
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Valor e Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  Valor e Cronograma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Valor Base (R$)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleChange('value', e.target.value)}
                      placeholder="0.00"
                      className="bg-white/5 border-white/10"
                      step="0.01"
                    />
                    {estimatedValue > 0 && (
                      <p className="text-xs text-green-400">
                        ✨ Sugestão: R$ {estimatedValue.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTimeline">Prazo de Entrega</Label>
                    <Select 
                      value={formData.deliveryTimeline}
                      onValueChange={(value) => handleChange('deliveryTimeline', value)}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3 semanas">2-3 semanas (Express)</SelectItem>
                        <SelectItem value="4-6 semanas">4-6 semanas (Padrão)</SelectItem>
                        <SelectItem value="6-8 semanas">6-8 semanas (Completo)</SelectItem>
                        <SelectItem value="8-12 semanas">8-12 semanas (Premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Descrição do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Personalizada</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Descreva os objetivos específicos do projeto, contexto da marca, público-alvo..."
                    className="bg-white/5 border-white/10 min-h-[120px]"
                  />
                  <p className="text-xs text-white/60">
                    Deixe vazio para usar descrição padrão baseada no tipo de projeto
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 pt-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.client || !formData.projectType || !formData.clientSize}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Criando...' : 'Criar Proposta'}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}