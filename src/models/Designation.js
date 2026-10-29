import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,unique:true,trim:true},department:{type:mongoose.Schema.Types.ObjectId,ref:'Department'}},{timestamps:true});
export default mongoose.models.Designation || mongoose.model('Designation',schema);
