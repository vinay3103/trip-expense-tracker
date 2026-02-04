import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function handler(event) {
  const { id } = JSON.parse(event.body);

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  return { statusCode:200, body:JSON.stringify({success:true}) };
}
