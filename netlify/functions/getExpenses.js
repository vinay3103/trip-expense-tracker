const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);
exports.handler=async()=>{
const {data}=await supabase.from("expenses").select("*");
return{statusCode:200,body:JSON.stringify(data)};
};
