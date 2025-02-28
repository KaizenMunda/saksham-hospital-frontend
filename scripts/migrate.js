const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const env = process.argv[2]
if (!['development', 'production'].includes(env)) {
  console.error('Please specify environment: development or production')
  process.exit(1)
}

// Load appropriate environment variables
require('dotenv').config({
  path: env === 'development' ? '.env.local' : '.env.production'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function migrate() {
  try {
    // Read schema file
    const schema = fs.readFileSync(
      path.join(__dirname, '../supabase/schema.sql'),
      'utf8'
    )

    // Execute schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema })
    if (error) throw error

    console.log(`Successfully migrated ${env} database`)
  } catch (error) {
    console.error(`Failed to migrate ${env} database:`, error)
    process.exit(1)
  }
}

migrate() 