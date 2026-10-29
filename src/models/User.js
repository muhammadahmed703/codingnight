import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name:{type:String,required:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true}, passwordHash:{type:String,required:true},
  role:{type:String,enum:['admin','hr','employee'],required:true}, employee:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',default:null},
  active:{type:Boolean,default:true}, mustChangePassword:{type:Boolean,default:false}, lastLogin:Date
},{timestamps:true});
export default mongoose.models.User || mongoose.model('User',schema);
