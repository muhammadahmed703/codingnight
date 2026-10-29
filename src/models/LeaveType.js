import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,unique:true},code:{type:String,required:true,unique:true,uppercase:true},annualQuota:{type:Number,default:0},paid:{type:Boolean,default:true},unlimited:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.models.LeaveType || mongoose.model('LeaveType',schema);
