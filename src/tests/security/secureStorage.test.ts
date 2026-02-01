/**
 * Secure Storage Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { secureStorage, storageHelpers } from '../../lib/security/secureStorage';

describe('Secure Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('setItem and getItem', () => {
    it('should store and retrieve string data', async () => {
      await secureStorage.setItem('test', 'value');
      const retrieved = await secureStorage.getItem<string>('test');
      
      expect(retrieved).toBe('value');
    });

    it('should store and retrieve object data', async () => {
      const data = { name: 'test', value: 123 };
      await secureStorage.setItem('obj', data);
      const retrieved = await secureStorage.getItem<typeof data>('obj');
      
      expect(retrieved).toEqual(data);
    });

    it('should encrypt sensitive data by default', async () => {
      await secureStorage.setItem('sensitive', 'secret', { encrypt: true });
      
      // Check that raw storage is encrypted
      const raw = sessionStorage.getItem('sensitive');
      expect(raw).toBeDefined();
      expect(raw).not.toContain('secret');
    });

    it('should return null for non-existent items', async () => {
      const result = await secureStorage.getItem('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire items after TTL', async () => {
      await secureStorage.setItem('temp', 'value', { ttl: 100 }); // 100ms TTL
      
      // Should exist immediately
      const immediate = await secureStorage.getItem('temp');
      expect(immediate).toBe('value');
      
      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be null after expiry
      const expired = await secureStorage.getItem('temp');
      expect(expired).toBeNull();
    });

    it('should not expire if no TTL set', async () => {
      await secureStorage.setItem('permanent', 'value');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await secureStorage.getItem('permanent');
      expect(result).toBe('value');
    });
  });

  describe('removeItem and clear', () => {
    it('should remove specific item', async () => {
      await secureStorage.setItem('test', 'value');
      secureStorage.removeItem('test');
      
      const result = await secureStorage.getItem('test');
      expect(result).toBeNull();
    });

    it('should clear all items', async () => {
      await secureStorage.setItem('test1', 'value1');
      await secureStorage.setItem('test2', 'value2');
      
      secureStorage.clear();
      
      const result1 = await secureStorage.getItem('test1');
      const result2 = await secureStorage.getItem('test2');
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('hasItem', () => {
    it('should return true for existing items', async () => {
      await secureStorage.setItem('test', 'value');
      expect(secureStorage.hasItem('test')).toBe(true);
    });

    it('should return false for non-existent items', () => {
      expect(secureStorage.hasItem('nonexistent')).toBe(false);
    });
  });

  describe('Storage Helpers', () => {
    it('should store and retrieve auth token', async () => {
      await storageHelpers.setAuthToken('token123');
      const token = await storageHelpers.getAuthToken();
      
      expect(token).toBe('token123');
    });

    it('should store and retrieve user preferences', async () => {
      const prefs = { theme: 'dark', language: 'en' };
      await storageHelpers.setUserPreferences(prefs);
      const retrieved = await storageHelpers.getUserPreferences();
      
      expect(retrieved).toEqual(prefs);
    });
  });
});
