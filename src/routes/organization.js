import { Router } from 'express';
import Company from '../models/Company.js'; import Department from '../models/Department.js'; import Designation from '../models/Designation.js'; import LeaveType from '../models/LeaveType.js'; import Holiday from '../models/Holiday.js';
import { auth,allow } from '../middleware/auth.js'; import { asyncHandler } from '../utils/http.js'; import { audit } from '../middleware/audit.js';
const r=Router(); r.use(auth);
r.get('/',asyncHandler(async(_req,res)=>res.json({company:await Company.findOne(),departments:await Department.find().sort('name'),designations:await Designation.find().populate('department').sort('name'),leaveTypes:await LeaveType.find().sort('name'),holidays:await Holiday.find().sort('date')})));
r.put('/company',allow('admin'),asyncHandler(async(req,res)=>{const before=await Company.findOne().lean(); const c=await Company.findOneAndUpdate({},req.body,{new:true,runValidators:true}); await audit(req,'UPDATE','Company',c._id,before,c.toObject()); res.json(c);}));
for (const [path,Model] of [['departments',Department],['designations',Designation],['leave-types',LeaveType],['holidays',Holiday]]) {
  r.post('/'+path,allow('admin'),asyncHandler(async(req,res)=>{const doc=await Model.create(req.body); await audit(req,'CREATE',Model.modelName,doc._id,null,doc.toObject()); res.status(201).json(doc);}));
  r.put('/'+path+'/:id',allow('admin'),asyncHandler(async(req,res)=>{const before=await Model.findById(req.params.id).lean(); const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}); await audit(req,'UPDATE',Model.modelName,doc._id,before,doc.toObject()); res.json(doc);}));
  r.delete('/'+path+'/:id',allow('admin'),asyncHandler(async(req,res)=>{const before=await Model.findById(req.params.id).lean(); await Model.findByIdAndDelete(req.params.id); await audit(req,'DELETE',Model.modelName,req.params.id,before,null); res.json({message:'Deleted'});}));
}
export default r;
