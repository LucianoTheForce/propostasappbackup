import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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

        // TEMPORARY BYPASS - REMOVE IN PRODUCTION
        if (process.env.AUTH_BYPASS === 'true' && 
            credentials.email === 'admin@theforce.cc' && 
            credentials.password === 'admin123') {
          console.log('Using auth bypass for admin@theforce.cc')
          return {
            id: 'bypass-admin-id',
            email: 'admin@theforce.cc',
            name: 'Admin (Bypass)',
            role: 'admin'
          }
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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our users table
          const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email!)
            .single()

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError)
            return false
          }

          // If user doesn't exist, create them
          if (!existingUser) {
            // Check if this is the first user
            const { count } = await supabaseAdmin
              .from('users')
              .select('id', { count: 'exact', head: true })

            const isFirstUser = count === 0

            const { error: createError } = await supabaseAdmin
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                role: isFirstUser ? 'admin' : 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (createError) {
              console.error('Error creating user:', createError)
              return false
            }
          }

          return true
        } catch (error) {
          console.error('SignIn error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user) {
        // Fetch user role from database
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('role')
          .eq('email', user.email!)
          .single()

        if (userData) {
          token.role = userData.role
        }
      }
      
      if (user) {
        token.id = user.id
        if ((user as any).role) {
          token.role = (user as any).role
        }
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