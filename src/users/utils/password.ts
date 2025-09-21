import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scrypt(plainPassword, salt, 64)) as Buffer;
  return `${salt.toString('hex')}.${derivedKey.toString('hex')}`;
}

export async function verifyPassword(
  plainPassword: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split('.');
  if (!saltHex || !hashHex) {
    return false;
  }
  const salt = Buffer.from(saltHex, 'hex');
  const expectedHash = Buffer.from(hashHex, 'hex');
  const derivedKey = (await scrypt(
    plainPassword,
    salt,
    expectedHash.length,
  )) as Buffer;
  return timingSafeEqual(derivedKey, expectedHash);
}
