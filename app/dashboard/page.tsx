'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Download, Eye, Edit2, MoreVertical } from 'lucide-react'
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
} from '@/components/ui/dropdown-menu'
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchProposals()
    }
  }, [status, router])

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

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalValue = proposals.reduce((sum, proposal) => sum + proposal.value, 0)
  const approvedCount = proposals.filter(p => p.status === 'approved').length
  const approvalRate = proposals.length > 0 ? (approvedCount / proposals.length) * 100 : 0

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">THE FORCE</h1>
            <p className="text-sm text-white/60">Proposal Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">
              {session?.user?.name || session?.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/api/auth/signout')}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="text-sm text-white/60 mb-2">Total Proposals</div>
            <div className="text-3xl font-bold">{proposals.length}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="text-sm text-white/60 mb-2">Total Value</div>
            <div className="text-3xl font-bold">
              R$ {totalValue.toLocaleString('pt-BR')}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="text-sm text-white/60 mb-2">Approved</div>
            <div className="text-3xl font-bold">{approvedCount}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-lg p-6"
          >
            <div className="text-sm text-white/60 mb-2">Approval Rate</div>
            <div className="text-3xl font-bold">{approvalRate.toFixed(1)}%</div>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="viewed">Viewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Button onClick={() => router.push('/proposals/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Proposal
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Date Sent</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Version</TableHead>
                <TableHead className="text-white">Value</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id} className="border-white/10">
                  <TableCell className="font-medium">{proposal.name}</TableCell>
                  <TableCell>{proposal.client}</TableCell>
                  <TableCell>
                    {proposal.date_sent
                      ? format(new Date(proposal.date_sent), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[proposal.status]} text-white`}>
                      {statusLabels[proposal.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>v{proposal.version}</TableCell>
                  <TableCell>R$ {proposal.value.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black border-white/10">
                        <DropdownMenuItem
                          onClick={() => window.open(`/proposals/${proposal.slug}`, '_blank')}
                          className="text-white hover:bg-white/10"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/proposals/${proposal.slug}/edit`)}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}