import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newData = req.body;

      // Delete all existing rows
      const { error: deleteError } = await supabase.from('inventory').delete().neq('code', '');

      if (deleteError) {
        throw deleteError;
      }

      // Insert new data
      const { error: insertError } = await supabase.from('inventory').insert(newData);

      if (insertError) {
        throw insertError;
      }

      res.status(200).json({ message: 'Data exported successfully!' });
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}