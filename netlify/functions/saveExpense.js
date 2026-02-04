import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function handler(event) {
  const data = JSON.parse(event.body);

  const { error } = await supabase
    .from('expenses')
    .insert([data]);

  if (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }

  return { statusCode: 200, body: JSON.stringify({ success:true }) };
}
