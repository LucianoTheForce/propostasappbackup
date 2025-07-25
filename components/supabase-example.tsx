'use client'

import { useSupabase } from '@/hooks/use-supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function SupabaseExample() {
  const { user, loading, signIn, signUp, signOut } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (loading) {
    return <div>Carregando...</div>
  }

  if (user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
        <p className="mb-4">Email: {user.email}</p>
        <Button onClick={signOut}>Sair</Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={() => signIn(email, password)}>
            Entrar
          </Button>
          <Button variant="outline" onClick={() => signUp(email, password)}>
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  )
} 