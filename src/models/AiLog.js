import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},role:String,prompt:String,tool:String,response:String,success:{type:Boolean,default:true},durationMs:Number},{timestamps:true});
export default mongoose.models.AiLog || mongoose.model('AiLog',schema);
