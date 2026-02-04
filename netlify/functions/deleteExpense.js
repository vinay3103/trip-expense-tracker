const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function (event) {
  const { id } = JSON.parse(event.body);
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { statusCode:500, body:JSON.stringify(error) };
  return { statusCode:200, body:JSON.stringify({success:true}) };
};
