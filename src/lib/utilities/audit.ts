import prisma from '../db';

export async function logAudit(options: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId || null,
        ipAddress: options.ipAddress || null,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
