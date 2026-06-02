import { config } from "dotenv";
import mongoose from "mongoose";

const DB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO conected Sucess Ah Poy: ${connect.connection.host}`,)
    }catch(err){
        console.error(`Mongo connection Error Ah poy , ${err.message}`);
        process.exit(1);
    }
}
export default DB;