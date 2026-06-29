import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { mockUsers, mockBrigades } from './src/data/mockData.ts';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting seed process...');
  
  // Seed in batches of 100 to avoid limits
  const BATCH_SIZE = 100;
  
  // 1. Seed Users
  console.log('Seeding ' + mockUsers.length + ' users...');
  for (let i = 0; i < mockUsers.length; i += BATCH_SIZE) {
    const batch = mockUsers.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('users').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('Error batch ' + i + ':', error.message);
    } else {
      console.log('Users batch ' + (i/BATCH_SIZE + 1) + ' OK (' + batch.length + ' rows)');
    }
  }

  // 2. Seed Brigades
  console.log('Seeding ' + mockBrigades.length + ' brigades...');
  for (let i = 0; i < mockBrigades.length; i += BATCH_SIZE) {
    const batch = mockBrigades.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('brigades').upsert(batch, { onConflict: 'id' });
    if (error) {
      console.error('Error batch ' + i + ':', error.message);
    } else {
      console.log('Brigades batch ' + (i/BATCH_SIZE + 1) + ' OK (' + batch.length + ' rows)');
    }
  }
  
  console.log('Seed complete!');
}

seed().catch(console.error);
