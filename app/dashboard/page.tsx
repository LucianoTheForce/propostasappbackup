'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Download, Eye, Edit2, MoreVertical, TrendingUp, Calendar, DollarSign, Target, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { supabase, type Proposal } from '@/lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusColors = {
  draft: 'bg-gray-500',
  sent: 'bg-blue-500',
  viewed: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
}

const statusLabels = {
  draft: 'Rascunho',
  sent: 'Enviada',
  viewed: 'Visualizada',
  approved: 'Aprovada',
  rejected: 'Reprovada',
}

export default function DashboardPage() {
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProposals(data || [])
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProposals = proposals
    .filter((proposal) => {
      const matchesSearch = 
        proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case 'value':
          aVal = a.value
          bVal = b.value
          break
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        default:
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

  // Calculate advanced statistics
  const stats = {
    total: proposals.length,
    approved: proposals.filter(p => p.status === 'approved').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    draft: proposals.filter(p => p.status === 'draft').length,
    viewed: proposals.filter(p => p.status === 'viewed').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    totalValue: proposals.reduce((sum, p) => sum + p.value, 0),
    approvedValue: proposals.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.value, 0),
    avgValue: proposals.length > 0 ? proposals.reduce((sum, p) => sum + p.value, 0) / proposals.length : 0,
    conversionRate: proposals.length > 0 ? (proposals.filter(p => p.status === 'approved').length / proposals.length) * 100 : 0,
    thisMonth: proposals.filter(p => {
      const proposalDate = new Date(p.created_at)
      const now = new Date()
      return proposalDate.getMonth() === now.getMonth() && proposalDate.getFullYear() === now.getFullYear()
    }).length
  }

  const handleSort = (column: 'date' | 'value' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const exportToCSV = () => {
    const csvData = proposals.map(p => ({
      Nome: p.name,
      Cliente: p.client,
      Valor: p.value,
      Status: statusLabels[p.status],
      'Data Criação': format(new Date(p.created_at), 'dd/MM/yyyy', { locale: ptBR }),
      Versão: p.version
    }))
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `propostas-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              THE FORCE
            </h1>
            <p className="text-sm text-white/60">Sistema de Gestão de Propostas</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              Admin User
            </span>
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total</CardTitle>
                <FileText className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <p className="text-xs text-white/60">propostas criadas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-white/60">em propostas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Taxa Conversão</CardTitle>
                <Target className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-white/60">aprovação</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Aprovadas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
                <p className="text-xs text-white/60">R$ {stats.approvedValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.thisMonth}</div>
                <p className="text-xs text-white/60">novas propostas</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Ticket Médio</CardTitle>
                <Users className="h-4 w-4 text-white/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  R$ {stats.avgValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-white/60">por proposta</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Button
            onClick={() => router.push('/proposals/new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Proposta
          </Button>
          
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar por nome ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === 'all' ? 'Todos Status' : statusLabels[statusFilter as keyof typeof statusLabels]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Todos os Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2" />
                  Rascunho
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('sent')}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  Enviada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('viewed')}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  Visualizada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Aprovada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  Rejeitada
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={exportToCSV}
              className="border-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Enhanced Table */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead 
                    className="text-white/60 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Proposta {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-white/60">Cliente</TableHead>
                  <TableHead 
                    className="text-white/60 cursor-pointer hover:text-white"
                    onClick={() => handleSort('value')}
                  >
                    Valor {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  <TableHead 
                    className="text-white/60 cursor-pointer hover:text-white"
                    onClick={() => handleSort('date')}
                  >
                    Data {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead className="text-white/60">Versão</TableHead>
                  <TableHead className="text-white/60 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium">{proposal.name}</TableCell>
                    <TableCell className="text-white/80">{proposal.client}</TableCell>
                    <TableCell className="font-mono">
                      R$ {proposal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[proposal.status]} text-white border-0`}
                      >
                        {statusLabels[proposal.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {format(new Date(proposal.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        v{proposal.version}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-white/10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/proposals/${proposal.slug}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/proposals/${proposal.slug}/edit`)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredAndSortedProposals.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Nenhuma proposta encontrada com os filtros aplicados'
                    : 'Nenhuma proposta criada ainda'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <div className="mt-6 text-sm text-white/60 text-center">
          Exibindo {filteredAndSortedProposals.length} de {proposals.length} propostas
        </div>
      </div>
    </div>
  )
}