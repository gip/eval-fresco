// API configuration for detecting environment and setting API endpoints

export const API_CONFIG = {
  // Detect if running in Tauri desktop mode
  // Tauri injects __TAURI_INTERNALS__ into the window object
  isTauri: typeof window !== 'undefined' &&
           (window as any).__TAURI_INTERNALS__ !== undefined,

  // API base URL for web mode
  // Can be overridden with VITE_API_URL environment variable
  // Default: http://localhost:3001 for local development
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

// Log the current mode for debugging
if (import.meta.env.DEV) {
  console.log('🔧 API Config:', {
    mode: API_CONFIG.isTauri ? 'Tauri Desktop' : 'Web Browser',
    apiBaseUrl: API_CONFIG.isTauri ? 'IPC' : API_CONFIG.apiBaseUrl,
  });
}
