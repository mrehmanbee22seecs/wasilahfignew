/**
 * Secure Storage Utility
 * 
 * @fileoverview
 * Provides encrypted storage for sensitive data with automatic expiry.
 * Wraps localStorage/sessionStorage with encryption and validation.
 * 
 * ## Features:
 * - AES-GCM encryption for sensitive data
 * - Automatic key rotation
 * - TTL (Time To Live) support
 * - Type-safe storage operations
 * - Tamper detection
 * 
 * ## Usage:
 * 
 * ```typescript
 * import { secureStorage } from '@/lib/security/secureStorage';
 * 
 * // Store sensitive data
 * secureStorage.setItem('userToken', token, { ttl: 3600000 }); // 1 hour
 * 
 * // Retrieve data
 * const token = secureStorage.getItem<string>('userToken');
 * 
 * // Remove data
 * secureStorage.removeItem('userToken');
 * 
 * // Clear all
 * secureStorage.clear();
 * ```
 * 
 * @module lib/security/secureStorage
 * @since 2026-02-01
 */

/**
 * Storage options
 */
interface StorageOptions {
  /** Time to live in milliseconds */
  ttl?: number;
  /** Whether to encrypt the data (default: true for sensitive data) */
  encrypt?: boolean;
  /** Storage type (default: sessionStorage) */
  storageType?: 'localStorage' | 'sessionStorage';
}

/**
 * Stored item structure
 */
interface StoredItem<T> {
  value: T;
  timestamp: number;
  ttl?: number;
  encrypted: boolean;
  checksum?: string;
}

/**
 * Encryption key storage
 */
const ENCRYPTION_KEY_STORAGE_KEY = '_secure_storage_key';
const KEY_ROTATION_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a cryptographic key for encryption
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or create encryption key
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  try {
    const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_STORAGE_KEY);
    
    if (storedKey) {
      const keyData = JSON.parse(storedKey);
      const keyAge = Date.now() - keyData.timestamp;
      
      // Rotate key if older than rotation interval
      if (keyAge < KEY_ROTATION_INTERVAL) {
        const keyBuffer = Uint8Array.from(atob(keyData.key), c => c.charCodeAt(0));
        return await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
      }
    }
    
    // Generate new key
    const key = await generateEncryptionKey();
    const exported = await crypto.subtle.exportKey('raw', key);
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    
    sessionStorage.setItem(
      ENCRYPTION_KEY_STORAGE_KEY,
      JSON.stringify({
        key: keyBase64,
        timestamp: Date.now(),
      })
    );
    
    return key;
  } catch (error) {
    console.error('Failed to get encryption key:', error);
    throw new Error('Encryption key generation failed');
  }
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(data: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Data encryption failed');
  }
}

/**
 * Decrypt data using AES-GCM
 */
async function decryptData(encryptedData: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    
    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Data decryption failed');
  }
}

/**
 * Generate checksum for tamper detection
 */
async function generateChecksum(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Secure Storage class
 */
class SecureStorage {
  /**
   * Store an item securely
   */
  async setItem<T>(
    key: string,
    value: T,
    options: StorageOptions = {}
  ): Promise<void> {
    const {
      ttl,
      encrypt = true,
      storageType = 'sessionStorage',
    } = options;
    
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      
      const item: StoredItem<T> = {
        value,
        timestamp: Date.now(),
        ttl,
        encrypted: encrypt,
      };
      
      const serialized = JSON.stringify(item);
      
      // Generate checksum for tamper detection
      item.checksum = await generateChecksum(serialized);
      
      let dataToStore = JSON.stringify(item);
      
      // Encrypt if requested
      if (encrypt) {
        dataToStore = await encryptData(dataToStore);
      }
      
      storage.setItem(key, dataToStore);
    } catch (error) {
      console.error('Failed to store item:', error);
      throw new Error(`Failed to store item: ${key}`);
    }
  }
  
  /**
   * Retrieve an item securely
   */
  async getItem<T>(key: string, storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage'): Promise<T | null> {
    try {
      const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
      const storedData = storage.getItem(key);
      
      if (!storedData) {
        return null;
      }
      
      let dataToProcess = storedData;
      
      // Try to decrypt (if it's encrypted)
      try {
        dataToProcess = await decryptData(storedData);
      } catch {
        // Data might not be encrypted, continue with original
      }
      
      const item: StoredItem<T> = JSON.parse(dataToProcess);
      
      // Check if item has expired
      if (item.ttl) {
        const age = Date.now() - item.timestamp;
        if (age > item.ttl) {
          this.removeItem(key, storageType);
          return null;
        }
      }
      
      // Verify checksum (if available)
      if (item.checksum) {
        const { checksum, ...dataWithoutChecksum } = item;
        const expectedChecksum = await generateChecksum(JSON.stringify(dataWithoutChecksum));
        
        if (checksum !== expectedChecksum) {
          console.warn('Tampered data detected, removing item:', key);
          this.removeItem(key, storageType);
          return null;
        }
      }
      
      return item.value;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  }
  
  /**
   * Remove an item
   */
  removeItem(key: string, storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage'): void {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.removeItem(key);
  }
  
  /**
   * Clear all items
   */
  clear(storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage'): void {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    storage.clear();
  }
  
  /**
   * Check if an item exists
   */
  hasItem(key: string, storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage'): boolean {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    return storage.getItem(key) !== null;
  }
  
  /**
   * Clean up expired items
   */
  async cleanupExpired(storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage'): Promise<void> {
    const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    const keys = Object.keys(storage);
    
    for (const key of keys) {
      try {
        const value = await this.getItem(key, storageType);
        // getItem automatically removes expired items
      } catch {
        // Ignore errors during cleanup
      }
    }
  }
}

/**
 * Export singleton instance
 */
export const secureStorage = new SecureStorage();

/**
 * Utility functions for common storage patterns
 */
export const storageHelpers = {
  /**
   * Store authentication token securely
   */
  async setAuthToken(token: string, expiresIn: number = 3600000): Promise<void> {
    await secureStorage.setItem('auth_token', token, {
      ttl: expiresIn,
      encrypt: true,
      storageType: 'sessionStorage',
    });
  },
  
  /**
   * Get authentication token
   */
  async getAuthToken(): Promise<string | null> {
    return await secureStorage.getItem<string>('auth_token', 'sessionStorage');
  },
  
  /**
   * Store user preferences (non-sensitive)
   */
  async setUserPreferences(preferences: Record<string, any>): Promise<void> {
    await secureStorage.setItem('user_preferences', preferences, {
      encrypt: false,
      storageType: 'localStorage',
    });
  },
  
  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<Record<string, any> | null> {
    return await secureStorage.getItem<Record<string, any>>('user_preferences', 'localStorage');
  },
};

/**
 * Initialize secure storage (run on app startup)
 */
export async function initializeSecureStorage(): Promise<void> {
  try {
    // Clean up expired items
    await secureStorage.cleanupExpired('sessionStorage');
    await secureStorage.cleanupExpired('localStorage');
    
    console.log('[Security] Secure storage initialized');
  } catch (error) {
    console.error('[Security] Failed to initialize secure storage:', error);
  }
}
