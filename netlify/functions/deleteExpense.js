const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);
exports.handler=async(e)=>{
const {id}=JSON.parse(e.body);
await supabase.from("expenses").delete().eq("id",id);
return{statusCode:200,body:"ok"};
};
