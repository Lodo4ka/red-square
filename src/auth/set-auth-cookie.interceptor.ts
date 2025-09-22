import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import {
  AUTH_COOKIE_ACTION_KEY,
  AuthCookieAction,
} from './auth-cookie.decorator';

@Injectable()
export class SetAuthCookieInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<AuthCookieAction | undefined>(
      AUTH_COOKIE_ACTION_KEY,
      context.getHandler(),
    );
    const http = context.switchToHttp();
    const res = http.getResponse<Response>();
    return next.handle().pipe(
      tap((data: unknown) => {
        if (action === 'login') {
          if (!isUserLike(data)) return;
          const { id: userId, name, role } = data;
          if (typeof userId !== 'number' || !name || !role) return;

          const token = this.authService.signToken({ sub: userId, name, role });
          const maxAgeMs =
            this.configService.get<number>('JWT_MAX_AGE_MS') ??
            7 * 24 * 60 * 60 * 1000;
          res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: maxAgeMs,
          });
          return;
        }
        if (action === 'logout') {
          res.clearCookie('access_token', { path: '/' });
          return;
        }
      }),
    );
  }
}

function isUserLike(
  data: unknown,
): data is { id: number; name: string; role: string } {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.role === 'string'
  );
}
