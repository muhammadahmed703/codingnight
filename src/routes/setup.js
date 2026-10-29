import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Company from '../models/Company.js';
import User from '../models/User.js';
import { asyncHandler, badRequest } from '../utils/http.js';
import { ensureDefaultLeaveTypes } from '../services/bootstrapService.js';
const r=Router();
r.get('/status',asyncHandler(async(_req,res)=>res.json({needsSetup:(await User.countDocuments())===0})));
r.post('/',asyncHandler(async(req,res)=>{
  if(await User.countDocuments()) throw badRequest('Setup already completed',409);
  const {companyName,officeStart='09:00',graceMinutes=15,weekendDays=[0,6],officeLat,officeLng,officeRadius=150,adminName,email,password}=req.body;
  if(!companyName||!adminName||!email||!password) throw badRequest('Company name, Admin name, email and password are required');
  if(password.length<8) throw badRequest('Password must be at least 8 characters');
  const company=await Company.create({name:companyName,officeStart,graceMinutes,weekendDays,officeLat,officeLng,officeRadius});
  const admin=await User.create({name:adminName,email:email.toLowerCase(),passwordHash:await bcrypt.hash(password,12),role:'admin'});
  await ensureDefaultLeaveTypes();
  res.status(201).json({message:'Setup complete',company:{id:company._id,name:company.name},admin:{id:admin._id,email:admin.email}});
}));
export default r;
