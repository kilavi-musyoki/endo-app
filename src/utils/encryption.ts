/**
 * Client-Side Field-Level Encryption (E2EE) using the Web Crypto API.
 * Uses AES-GCM (256-bit) with keys derived via PBKDF2 (100,000 iterations of SHA-256).
 *
 * Designed for confidential reproductive and menstrual health fields (notes, pain locations,
 * intimate symptoms) prior to cloud synchronization or local persistence.
 */

import { LogEntry, PainLocation, PainDetail } from '../types';

const ENCRYPTION_PREFIX = 'enc:v1:';
const DEFAULT_SALT_KEY = 'endocare_e2ee_salt';
const PBKDF2_ITERATIONS = 100000;

/**
 * Returns a consistent per-device cryptographic salt.
 * Generates and persists a random 16-byte salt if one does not already exist.
 */
export function getOrCreateDeviceSalt(): Uint8Array {
  try {
    const existing = localStorage.getItem(DEFAULT_SALT_KEY);
    if (existing) {
      const binary = atob(existing);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
  } catch {
    // Fall back to new generation
  }

  const newSalt = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(newSalt);
    try {
      const b64 = btoa(String.fromCharCode(...newSalt));
      localStorage.setItem(DEFAULT_SALT_KEY, b64);
    } catch {
      // storage unavailable
    }
  }
  return newSalt;
}

/**
 * Derives an AES-GCM 256-bit key from a user-supplied PIN or passphrase using PBKDF2.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Checks if a string value was encrypted using this utility.
 */
export function isEncrypted(value?: string | null): boolean {
  return typeof value === 'string' && value.startsWith(ENCRYPTION_PREFIX);
}

/**
 * Encrypts a plaintext string into a safe armored string format:
 * `enc:v1:<base64-salt>:<base64-iv>:<base64-ciphertext>`
 */
export async function encryptText(plainText: string, passphrase: string): Promise<string> {
  if (!plainText || !passphrase) return plainText;
  if (!window.crypto || !window.crypto.subtle) {
    console.warn('Web Crypto API not available. Skipping client-side encryption.');
    return plainText;
  }

  const salt = getOrCreateDeviceSalt();
  const key = await deriveKey(passphrase, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encoded as BufferSource
  );

  const b64Salt = btoa(String.fromCharCode(...salt));
  const b64Iv = btoa(String.fromCharCode(...iv));
  const b64Cipher = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));

  return `${ENCRYPTION_PREFIX}${b64Salt}:${b64Iv}:${b64Cipher}`;
}

/**
 * Decrypts an armored encrypted string back into its original plaintext.
 * Returns the original value if it is not encrypted or if decryption fails.
 */
export async function decryptText(cipherString: string, passphrase: string): Promise<string> {
  if (!cipherString || !isEncrypted(cipherString) || !passphrase) {
    return cipherString;
  }

  try {
    const payload = cipherString.slice(ENCRYPTION_PREFIX.length);
    const [b64Salt, b64Iv, b64Cipher] = payload.split(':');
    if (!b64Salt || !b64Iv || !b64Cipher) return cipherString;

    const salt = Uint8Array.from(atob(b64Salt), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(b64Iv), c => c.charCodeAt(0));
    const cipherBytes = Uint8Array.from(atob(b64Cipher), c => c.charCodeAt(0));

    const key = await deriveKey(passphrase, salt);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      cipherBytes as BufferSource
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed. Passphrase may be incorrect.', err);
    return cipherString;
  }
}

/**
 * Encrypts arbitrary serializable objects (e.g. pain details, sensitive symptom arrays)
 */
export async function encryptObject<T>(data: T, passphrase: string): Promise<string> {
  const serialized = JSON.stringify(data);
  return encryptText(serialized, passphrase);
}

/**
 * Decrypts arbitrary serializable objects with a typed fallback
 */
export async function decryptObject<T>(cipherString: string, passphrase: string, fallback: T): Promise<T> {
  if (!isEncrypted(cipherString)) return fallback;
  try {
    const decrypted = await decryptText(cipherString, passphrase);
    return JSON.parse(decrypted) as T;
  } catch {
    return fallback;
  }
}

/**
 * Applies client-side encryption to sensitive fields of a LogEntry
 * (notes, painkiller details, custom notes).
 */
export async function encryptLogEntry(entry: LogEntry, passphrase: string): Promise<LogEntry> {
  if (!passphrase) return entry;

  let encryptedNotes = entry.notes;
  if (entry.notes && !isEncrypted(entry.notes)) {
    encryptedNotes = await encryptText(entry.notes, passphrase);
  }

  let encryptedPainkillerName = entry.painkillerName;
  if (entry.painkillerName && !isEncrypted(entry.painkillerName)) {
    encryptedPainkillerName = await encryptText(entry.painkillerName, passphrase);
  }

  return {
    ...entry,
    notes: encryptedNotes,
    painkillerName: encryptedPainkillerName
  };
}

/**
 * Decrypts sensitive fields of a LogEntry
 */
export async function decryptLogEntry(entry: LogEntry, passphrase: string): Promise<LogEntry> {
  if (!passphrase) return entry;

  let decryptedNotes = entry.notes;
  if (entry.notes && isEncrypted(entry.notes)) {
    decryptedNotes = await decryptText(entry.notes, passphrase);
  }

  let decryptedPainkillerName = entry.painkillerName;
  if (entry.painkillerName && isEncrypted(entry.painkillerName)) {
    decryptedPainkillerName = await decryptText(entry.painkillerName, passphrase);
  }

  return {
    ...entry,
    notes: decryptedNotes,
    painkillerName: decryptedPainkillerName
  };
}
