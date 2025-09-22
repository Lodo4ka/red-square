import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.service';

function getTokenFromCookies(cookies: unknown): string | null {
  if (cookies && typeof cookies === 'object' && 'access_token' in cookies) {
    const value = (cookies as Record<string, unknown>).access_token;
    if (typeof value === 'string') return value;
  }
  return null;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const rawCookies: unknown = (req as { cookies?: unknown }).cookies;
    const token = getTokenFromCookies(rawCookies);
    if (!token) {
      throw new UnauthorizedException('Неверный токен авторизации');
    }
    try {
      const payload = this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Неверный токен авторизации');
    }
  }
}
