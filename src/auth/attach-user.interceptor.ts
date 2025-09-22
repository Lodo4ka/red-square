import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { JwtPayload } from './auth.service';

@Injectable()
export class AttachUserToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: JwtPayload; body?: unknown }>();
    const userId = typeof req.user?.sub === 'number' ? req.user.sub : undefined;

    if (userId && req.body && typeof req.body === 'object') {
      const body = req.body as Record<string, unknown>;
      body.userId = userId;
    }

    return next.handle();
  }
}
