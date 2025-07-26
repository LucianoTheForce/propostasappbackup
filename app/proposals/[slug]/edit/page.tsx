'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Proposal } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Draggable from 'react-draggable'
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2, 
  Send,
  Save,
  Eye,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'

// Dynamic import for TipTap editor
const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function EditProposalPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // AI Chat State
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMinimized, setChatMinimized] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  
  // Editor State
  const [editorContent, setEditorContent] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (session) {
      fetchProposal()
    }
  }, [session, params.slug])

  const fetchProposal = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error) throw error
      
      setProposal(data)
      setEditorContent(data.content_json?.content || '')
      
      // Load chat history
      const { data: chatHistory } = await supabase
        .from('ai_chat_history')
        .select('messages')
        .eq('proposal_id', data.id)
        .single()
      
      if (chatHistory) {
        setChatMessages(chatHistory.messages)
      }
    } catch (error) {
      console.error('Error fetching proposal:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!proposal) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          content_json: { content: editorContent },
          updated_at: new Date().toISOString()
        })
        .eq('id', proposal.id)

      if (error) throw error
      
      // Save chat history
      await supabase
        .from('ai_chat_history')
        .upsert({
          proposal_id: proposal.id,
          user_id: session?.user?.id,
          messages: chatMessages
        })
    } catch (error) {
      console.error('Error saving proposal:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    }
    
    setChatMessages([...chatMessages, userMessage])
    setChatInput('')
    setChatLoading(true)
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          context: {
            proposalName: proposal?.name,
            client: proposal?.client,
            currentContent: editorContent,
            selectedText
          }
        })
      })
      
      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString()
      }
      
      setChatMessages([...chatMessages, userMessage, assistantMessage])
      
      // Apply AI suggestions if it's a content modification
      if (data.action === 'modify_content' && data.newContent) {
        setEditorContent(data.newContent)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setChatLoading(false)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      setSelectedText(selection.toString())
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 40
      })
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-lg font-bold">{proposal?.name}</h1>
              <p className="text-sm text-white/60">{proposal?.client}</p>
            </div>
            <Badge className="bg-white/10">v{proposal?.version}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/proposals/${proposal?.slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <div className="pt-20 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <Editor
            content={editorContent}
            onChange={setEditorContent}
            onTextSelect={handleTextSelection}
          />
        </div>
      </div>

      {/* Floating Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 bg-black border border-white/20 rounded-lg shadow-xl p-2 flex items-center gap-1"
            style={{
              left: toolbarPosition.x,
              top: toolbarPosition.y,
              transform: 'translateX(-50%)'
            }}
          >
            <Button size="sm" variant="ghost" className="p-1">
              <Bold className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <Italic className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <Button size="sm" variant="ghost" className="p-1">
              <Type className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <Palette className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <Button size="sm" variant="ghost" className="p-1">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <AlignRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat */}
      <Draggable
        handle=".chat-handle"
        bounds="parent"
        defaultPosition={{ x: window.innerWidth - 400, y: 100 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`fixed z-50 bg-black border border-white/20 rounded-lg shadow-2xl ${
            chatMinimized ? 'w-64' : 'w-96'
          }`}
        >
          {/* Chat Header */}
          <div className="chat-handle flex items-center justify-between p-4 border-b border-white/10 cursor-move">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setChatMinimized(!chatMinimized)}
              >
                {chatMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!chatMinimized && (
            <>
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-white/40 py-8">
                    <p className="mb-2">Hi! I can help you with:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Generate proposal sections</li>
                      <li>• Rewrite content</li>
                      <li>• Add technical details</li>
                      <li>• Translate text</li>
                      <li>• Create summaries</li>
                    </ul>
                  </div>
                )}
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI to help with your proposal..."
                    className="flex-1 bg-white/5 border-white/10"
                    disabled={chatLoading}
                  />
                  <Button type="submit" size="sm" disabled={chatLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </Draggable>

      {/* Reopen Chat Button */}
      {!chatOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-white text-black rounded-full p-4 shadow-xl hover:scale-105 transition-transform"
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  )
}