require('dotenv').config(); // Load environment variables from .env file
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Key are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Data fetched successfully:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testConnection();