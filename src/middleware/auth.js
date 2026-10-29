import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, badRequest } from '../utils/http.js';

export const auth = asyncHandler(async (req, _res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) throw badRequest('Authentication required', 401);
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
  const user = await User.findById(payload.sub).select('-passwordHash');
  if (!user || !user.active) throw badRequest('Account is inactive or missing', 401);
  req.user = user;
  next();
});

export const allow = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(badRequest('You do not have permission for this action', 403));
  next();
};
