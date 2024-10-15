import { Request } from 'express';

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  return xForwardedFor ? xForwardedFor.split(',')[0] : req.ip;
}
