'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    value: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content_json: {
            content: `<h1>${formData.name}</h1><p>Client: ${formData.client}</p><p>${formData.description}</p>`,
            sections: []
          }
        }),
      })

      if (!response.ok) throw new Error('Failed to create proposal')

      const proposal = await response.json()
      router.push(`/proposals/${proposal.slug}/edit`)
    } catch (error) {
      console.error('Error creating proposal:', error)
      alert('Failed to create proposal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold">Create New Proposal</h1>
            <p className="text-sm text-white/60">Set up the basic information for your proposal</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Proposal Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., ALMA 2026 - Visual Identity & Club Room Design"
                      className="bg-white/5 border-white/10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name *</Label>
                    <Input
                      id="client"
                      name="client"
                      value={formData.client}
                      onChange={handleChange}
                      placeholder="e.g., ALMA 2026"
                      className="bg-white/5 border-white/10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Estimated Value (R$)</Label>
                    <Input
                      id="value"
                      name="value"
                      type="number"
                      value={formData.value}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-white/5 border-white/10"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Initial Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of the proposal scope and objectives..."
                      className="bg-white/5 border-white/10 min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/dashboard')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !formData.name || !formData.client}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Creating...' : 'Create Proposal'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Templates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle>Quick Start Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      name: 'Brand Identity Proposal',
                      description: 'Complete brand identity development including logo, visual system, and brand guidelines.'
                    })}
                    className="p-4 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-medium mb-2">Brand Identity</h3>
                    <p className="text-sm text-white/60">Logo, visual system, brand guidelines</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      name: 'Digital Experience Proposal',
                      description: 'Website design and development with modern user experience and responsive design.'
                    })}
                    className="p-4 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-medium mb-2">Digital Experience</h3>
                    <p className="text-sm text-white/60">Website design and development</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      name: 'Space Design Proposal',
                      description: 'Interior design and space planning for commercial environments.'
                    })}
                    className="p-4 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-medium mb-2">Space Design</h3>
                    <p className="text-sm text-white/60">Interior design and space planning</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      name: 'Complete Package Proposal',
                      description: 'Full service package including brand identity, digital presence, and physical space design.'
                    })}
                    className="p-4 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-medium mb-2">Complete Package</h3>
                    <p className="text-sm text-white/60">Brand + Digital + Space</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}