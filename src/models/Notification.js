import mongoose from 'mongoose';
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},title:{type:String,required:true},message:{type:String,required:true},read:{type:Boolean,default:false},link:String},{timestamps:true});
export default mongoose.models.Notification || mongoose.model('Notification',schema);
