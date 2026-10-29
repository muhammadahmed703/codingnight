import mongoose from 'mongoose';
const schema=new mongoose.Schema({employee:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true},date:{type:Date,required:true},requestedCheckIn:Date,requestedCheckOut:Date,reason:{type:String,required:true},status:{type:String,enum:['pending','approved','rejected'],default:'pending'},reviewComment:String,reviewedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
export default mongoose.models.AttendanceCorrection || mongoose.model('AttendanceCorrection',schema);
