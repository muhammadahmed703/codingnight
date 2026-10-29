export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export function badRequest(message, status = 400) { const e = new Error(message); e.status = status; return e; }
