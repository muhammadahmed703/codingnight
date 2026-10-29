export const dateKey = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
export function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
export function endOfDay(d = new Date()) { const x = new Date(d); x.setHours(23,59,59,999); return x; }
export function monthBounds(value) {
  const [y, m] = value.split('-').map(Number);
  return { start: new Date(y, m - 1, 1), end: new Date(y, m, 0, 23,59,59,999) };
}
export function workingDaysBetween(start, end, holidays = [], weekendDays = [0,6]) {
  const holidaySet = new Set(holidays.map(h => dateKey(h.date || h)));
  let count = 0; const d = startOfDay(start); const last = startOfDay(end);
  while (d <= last) { if (!weekendDays.includes(d.getDay()) && !holidaySet.has(dateKey(d))) count++; d.setDate(d.getDate()+1); }
  return count;
}
export function parseTimeToMinutes(time='09:00') { const [h,m]=time.split(':').map(Number); return h*60+m; }
