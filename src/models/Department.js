import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,unique:true,trim:true},code:{type:String,trim:true,uppercase:true}},{timestamps:true});
export default mongoose.models.Department || mongoose.model('Department',schema);
