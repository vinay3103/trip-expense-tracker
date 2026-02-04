const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);
exports.handler=async(e)=>{
const data=JSON.parse(e.body);
await supabase.from("expenses").insert([data]);
return{statusCode:200,body:"ok"};
};
