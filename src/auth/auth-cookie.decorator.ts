import { SetMetadata } from '@nestjs/common';

export type AuthCookieAction = 'login' | 'logout';
export const AUTH_COOKIE_ACTION_KEY = 'auth_cookie_action';
export const AuthCookie = (action: AuthCookieAction) =>
  SetMetadata(AUTH_COOKIE_ACTION_KEY, action);
