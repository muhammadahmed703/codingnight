import AuditLog from '../models/AuditLog.js';
export async function audit(req, action, entity, entityId, before=null, after=null) {
  try {
    await AuditLog.create({ actor: req.user?._id, actorRole: req.user?.role, action, entity, entityId, before, after, ip: req.ip });
  } catch (e) { console.warn('Audit write failed:', e.message); }
}
