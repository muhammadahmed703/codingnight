import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  employee:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true},dateKey:{type:String,required:true},checkIn:{type:Date,required:true},checkOut:Date,hours:{type:Number,default:0},
  status:{type:String,enum:['present','late','half_day','missing_checkout'],default:'present'},source:{type:String,enum:['web','camera','correction'],default:'web'},location:{lat:Number,lng:Number,accuracy:Number}
},{timestamps:true});
schema.index({employee:1,dateKey:1},{unique:true});
export default mongoose.models.Attendance || mongoose.model('Attendance',schema);
