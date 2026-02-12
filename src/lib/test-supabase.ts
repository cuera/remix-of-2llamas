// Quick Supabase connection test – run via: npx vite-node src/lib/test-supabase.ts
import { supabase } from './supabase'

async function testConnection() {
    console.log('🔌 Testing Supabase connection...')
    console.log('   URL:', import.meta.env.VITE_SUPABASE_URL)

    // A simple health-check: query the auth settings endpoint
    const { data, error } = await supabase.auth.getSession()

    if (error) {
        console.error('❌ Connection failed:', error.message)
        process.exit(1)
    }

    console.log('✅ Supabase connection successful!')
    console.log('   Session data:', data)
}

testConnection()
