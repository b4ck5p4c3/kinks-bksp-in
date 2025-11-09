"use client";

import CryptoJS from "crypto-js";

// Generate a key from password using PBKDF2 with a salt
function deriveKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  }).toString();
}

export function encryptData(data: string, password: string): string {
  // Generate a random salt
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

  // Derive key from password
  const key = deriveKey(password, salt);

  // Encrypt data with derived key
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();

  // Combine salt and encrypted data
  return JSON.stringify({ salt, encrypted });
}

export function decryptData(encryptedData: string, password: string): string {
  try {
    // Parse salt and encrypted data
    const { salt, encrypted } = JSON.parse(encryptedData);

    // Derive the same key from password and salt
    const key = deriveKey(password, salt);

    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed");
    }

    return decrypted;
  } catch (e) {
    throw new Error("Invalid password or corrupted data");
  }
}
