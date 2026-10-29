import { Router } from 'express';import Announcement from '../models/Announcement.js';import Notification from '../models/Notification.js';import AuditLog from '../models/AuditLog.js';import {auth,allow} from '../middleware/auth.js';import {asyncHandler} from '../utils/http.js';import {audit} from '../middleware/audit.js';
const r=Router();r.use(auth);
r.get('/announcements',asyncHandler(async(req,res)=>{const roles=req.user.role==='employee'?['all','employee']:req.user.role==='hr'?['all','hr']:['all','hr','employee'];res.json(await Announcement.find({audience:{$in:roles}}).populate('postedBy','name role').sort('-createdAt'));}));
r.post('/announcements',allow('admin','hr'),asyncHandler(async(req,res)=>{const a=await Announcement.create({...req.body,postedBy:req.user._id});await audit(req,'POST_ANNOUNCEMENT','Announcement',a._id,null,a.toObject());res.status(201).json(a);}));
r.get('/notifications',asyncHandler(async(req,res)=>res.json(await Notification.find({user:req.user._id}).sort('-createdAt').limit(50))));
r.patch('/notifications/:id/read',asyncHandler(async(req,res)=>res.json(await Notification.findOneAndUpdate({_id:req.params.id,user:req.user._id},{read:true},{new:true}))));
r.get('/audit',allow('admin'),asyncHandler(async(_req,res)=>res.json(await AuditLog.find().populate('actor','name email role').sort('-createdAt').limit(300))));
export default r;
