import mongoose from 'mongoose';
const schema=new mongoose.Schema({actor:{type:mongoose.Schema.Types.ObjectId,ref:'User'},actorRole:String,action:{type:String,required:true},entity:{type:String,required:true},entityId:String,before:mongoose.Schema.Types.Mixed,after:mongoose.Schema.Types.Mixed,ip:String},{timestamps:true});
export default mongoose.models.AuditLog || mongoose.model('AuditLog',schema);
