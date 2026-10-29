import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, officeStart:{type:String,default:'09:00'}, graceMinutes:{type:Number,default:15},
  halfDayHours:{type:Number,default:5}, weekendDays:{type:[Number],default:[0,6]}, officeLat:Number, officeLng:Number, officeRadius:{type:Number,default:150},
  setupCompleted:{type:Boolean,default:true}
},{timestamps:true});
export default mongoose.models.Company || mongoose.model('Company',schema);
