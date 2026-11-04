import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * expo-secure-store has no web implementation (its web module is a literal
 * empty stub) — calling it there throws
 * "ExpoSecureStore.default.setValueWithKeyAsync is not a function".
 * Rota's real target is iOS/Android, where SecureStore's encrypted-at-rest
 * storage is exactly what a session token wants; this falls back to
 * localStorage only so the web preview (`npm run web`) doesn't crash.
 * Don't rely on this fallback for anything security-sensitive on web.
 */
const isWeb = Platform.OS === 'web';

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore — e.g. private browsing with storage disabled.
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore.
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
