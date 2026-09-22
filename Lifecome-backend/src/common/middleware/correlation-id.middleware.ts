import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

const HEADER = 'x-correlation-id';

/**
 * `request.id` is already populated by nestjs-pino's `genReqId` (see app.module.ts), which
 * reuses an inbound `x-correlation-id` header when present. This middleware just echoes that id
 * back on the response so callers (including browser/mobile clients) can log and support-thread
 * on the same id the server used (blueprint §7.1).
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'] & { id?: string }, res: FastifyReply['raw'], next: () => void): void {
    if (req.id) {
      res.setHeader(HEADER, req.id);
    }
    next();
  }
}
