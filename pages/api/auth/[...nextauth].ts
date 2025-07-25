import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role for auth
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password')
          return null
        }

        try {
          // Try to sign in with Supabase Auth
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (authError) {
            console.log('Supabase auth error:', authError.message)
            return null
          }

          if (!authData.user) {
            console.log('No user returned from Supabase')
            return null
          }

          // Check if user exists in our users table
          const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          if (userError) {
            console.log('User table error:', userError.message)
            
            // If user doesn't exist in our table, create them
            if (userError.code === 'PGRST116') {
              const { data: newUser, error: createError } = await supabaseAdmin
                .from('users')
                .insert({
                  id: authData.user.id,
                  email: authData.user.email!,
                  name: authData.user.user_metadata?.name || authData.user.email!.split('@')[0],
                  role: 'admin' // First user is admin
                })
                .select()
                .single()

              if (createError) {
                console.log('Error creating user:', createError.message)
                return null
              }

              return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
              }
            }
            return null
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
          }

        } catch (error) {
          console.log('Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)