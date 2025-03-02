import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Fetching data from Supabase...');

    const { data, error } = await supabase.from('inventory').select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data fetched successfully:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ message: 'Failed to load data' });
  }
}