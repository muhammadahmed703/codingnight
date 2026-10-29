import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import LeaveType from '../models/LeaveType.js';
import Holiday from '../models/Holiday.js';
import Company from '../models/Company.js';
import { monthBounds, workingDaysBetween } from '../utils/date.js';

function annualTax(annual){
  if(annual<=600000) return 0;
  if(annual<=1200000) return (annual-600000)*0.05;
  if(annual<=2400000) return 30000+(annual-1200000)*0.15;
  if(annual<=3600000) return 210000+(annual-2400000)*0.25;
  return 510000+(annual-3600000)*0.35;
}

export async function calculatePayroll(month){
  const {start,end}=monthBounds(month);
  const company=await Company.findOne();
  const holidays=await Holiday.find({date:{$gte:start,$lte:end}});
  const workingDays=workingDaysBetween(start,end,holidays,company?.weekendDays||[0,6]);
  const employees=await Employee.find({status:{$in:['active','probation']},joinDate:{$lte:end}});
  const unpaid=await LeaveType.findOne({code:'UNPAID'});
  const items=[];
  for(const e of employees){
    const attendance=await Attendance.find({employee:e._id,checkIn:{$gte:start,$lte:end}});
    const halfDays=attendance.filter(a=>a.status==='half_day').length;
    const attendanceKeys=new Set(attendance.map(a=>a.dateKey));
    const approvedLeaves=await LeaveRequest.find({employee:e._id,status:'approved',start:{$lte:end},end:{$gte:start}}).populate('leaveType');
    const unpaidDays=approvedLeaves.filter(l=>String(l.leaveType?._id)===String(unpaid?._id)).reduce((s,l)=>s+l.workingDays,0);
    let eligibleStart=e.joinDate>start?e.joinDate:start;
    let eligibleEnd=e.exitDate&&e.exitDate<end?e.exitDate:end;
    const eligibleWorking=workingDaysBetween(eligibleStart,eligibleEnd,holidays,company?.weekendDays||[0,6]);
    let approvedPaidDays=approvedLeaves.filter(l=>l.leaveType?.paid).reduce((s,l)=>s+l.workingDays,0);
    const credited=Math.min(eligibleWorking,attendanceKeys.size+approvedPaidDays+unpaidDays);
    const absentDays=Math.max(0,eligibleWorking-credited);
    const basic=e.basicSalary;
    const hra=basic*0.4, medical=basic*0.1, gross=basic+hra+medical;
    const perDay=workingDays?gross/workingDays:0;
    const deductions=perDay*(absentDays+unpaidDays+0.5*halfDays);
    const tax=annualTax(gross*12)/12;
    const net=Math.max(0,gross-deductions-tax);
    items.push({employee:e._id,employeeCode:e.employeeCode,name:`${e.firstName} ${e.lastName}`.trim(),basic,hra,medical,gross,workingDays:eligibleWorking,absentDays,unpaidDays,halfDays,deductions:Math.round(deductions),tax:Math.round(tax),net:Math.round(net)});
  }
  const totals=items.reduce((a,i)=>({gross:a.gross+i.gross,deductions:a.deductions+i.deductions,tax:a.tax+i.tax,net:a.net+i.net}),{gross:0,deductions:0,tax:0,net:0});
  return {items,totals};
}
