import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import PayrollRun from '../models/PayrollRun.js';
import { dateKey } from '../utils/date.js';

export async function companyDashboard(){
  const today=dateKey();
  const [headcount,present,late,onLeave,pendingLeave,lastPayroll]=await Promise.all([
    Employee.countDocuments({status:{$in:['active','probation']}}),
    Attendance.countDocuments({dateKey:today}),
    Attendance.countDocuments({dateKey:today,status:'late'}),
    LeaveRequest.countDocuments({status:'approved',start:{$lte:new Date()},end:{$gte:new Date()}}),
    LeaveRequest.countDocuments({status:'pending'}),
    PayrollRun.findOne({status:'finalized'}).sort({month:-1})
  ]);
  const depts=await Employee.aggregate([{$match:{status:{$in:['active','probation']}}},{$group:{_id:'$department',count:{$sum:1}}},{$lookup:{from:'departments',localField:'_id',foreignField:'_id',as:'d'}},{$project:{name:{$ifNull:[{$first:'$d.name'},'Unassigned']},count:1}}]);
  return {headcount,present,late,onLeave,pendingLeave,payrollCost:lastPayroll?.totals?.gross||0,avgSalary:headcount&&lastPayroll?Math.round((lastPayroll.totals.gross||0)/headcount):0,departments:depts};
}

export async function employeeDashboard(employeeId){
  const today=dateKey(); const now=new Date();
  const monday=new Date(now); monday.setDate(now.getDate()-((now.getDay()+6)%7)); monday.setHours(0,0,0,0);
  const attendance=await Attendance.find({employee:employeeId,checkIn:{$gte:monday}});
  const hours=attendance.reduce((s,a)=>s+(a.hours||0),0);
  const late=await Attendance.countDocuments({employee:employeeId,status:'late'});
  const pendingLeave=await LeaveRequest.countDocuments({employee:employeeId,status:'pending'});
  return {checkedInToday:!!(await Attendance.findOne({employee:employeeId,dateKey:today})),hoursThisWeek:Number(hours.toFixed(1)),lateCount:late,pendingLeave};
}
