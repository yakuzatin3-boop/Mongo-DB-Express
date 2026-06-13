import { config } from "dotenv";
import mongoose from "mongoose";

const DB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO conected Sucess Ah Poy: ${connect.connection.host}`,)
        try {
            const db = mongoose.connection.db;
            const paymentsColl = db.collection('payments');

            const idxs = await paymentsColl.indexes();
            const txIndex = idxs.find(i => i.name === 'transactionId_1');

            if (txIndex && !txIndex.sparse) {
                await paymentsColl.dropIndex('transactionId_1');
                console.log('Dropped non-sparse transactionId_1 index');
            } 
            await paymentsColl.createIndex({ transactionId: 1 }, { unique: true, sparse: true });
            console.log('Ensured sparse unique index on payments.transactionId');
        } catch (indexErr) {
            console.warn('Could not adjust payments indexes:', indexErr.message);
        }
    }catch(err){
        console.error(`Mongo connection Error Ah poy , ${err.message}`);
        process.exit(1);
    }
}
export default DB;