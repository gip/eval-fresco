// API client that automatically detects environment and uses appropriate communication method
// - Tauri mode: Uses IPC (invoke)
// - Web mode: Uses HTTP (fetch)

import { API_CONFIG } from '../config/api';

// Type definitions matching the Rust backend
export interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

/**
 * Greet API - example endpoint
 */
export async function greet(name: string): Promise<string> {
  if (API_CONFIG.isTauri) {
    // Tauri mode: use IPC
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('greet', { name });
  } else {
    // Web mode: use HTTP
    const url = new URL('/api/greet', API_CONFIG.apiBaseUrl);
    url.searchParams.append('name', name);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  }
}

/**
 * Get trades
 */
export async function getTrades(): Promise<Trade[]> {
  if (API_CONFIG.isTauri) {
    // Tauri mode: use IPC
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<Trade[]>('get_trades');
  } else {
    // Web mode: use HTTP
    const url = new URL('/api/trades', API_CONFIG.apiBaseUrl);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * Get market data for a symbol
 */
export async function getMarketData(symbol: string): Promise<MarketData> {
  if (API_CONFIG.isTauri) {
    // Tauri mode: use IPC
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<MarketData>('get_market_data', { symbol });
  } else {
    // Web mode: use HTTP
    const url = new URL('/api/market-data', API_CONFIG.apiBaseUrl);
    url.searchParams.append('symbol', symbol);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Add more API methods here as you build features
// Each method should:
// 1. Check if in Tauri mode using API_CONFIG.isTauri
// 2. Use invoke() for Tauri mode
// 3. Use fetch() for web mode
// 4. Handle errors appropriately
