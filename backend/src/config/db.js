const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('SUPABASE_URL or SUPABASE_ANON_KEY not set in environment.');
}

const supabase = createClient(
  supabaseUrl || 'https://xyzcompany.supabase.co',
  supabaseKey || 'public-anon-key'
);

module.exports = supabase;
