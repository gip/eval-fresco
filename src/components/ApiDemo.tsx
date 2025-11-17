// Example component demonstrating the API client
// Works in both Tauri desktop and web modes!

import { useState } from 'react';
import { greet, getTrades, getMarketData } from '../api/client';
import { API_CONFIG } from '../config/api';
import type { Trade, MarketData } from '../api/client';

export default function ApiDemo() {
  const [name, setName] = useState('World');
  const [greeting, setGreeting] = useState('');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGreet = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await greet(name);
      setGreeting(result);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrades = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getTrades();
      setTrades(result);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMarketData = async (symbol: string) => {
    try {
      setLoading(true);
      setError('');
      const result = await getMarketData(symbol);
      setMarketData(result);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Client Demo</h2>

      {/* Mode indicator */}
      <div style={{
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: API_CONFIG.isTauri ? '#e8f5e9' : '#e3f2fd',
        border: `2px solid ${API_CONFIG.isTauri ? '#4caf50' : '#2196f3'}`,
        borderRadius: '4px'
      }}>
        <strong>Mode:</strong> {API_CONFIG.isTauri ? '🖥️ Tauri Desktop (IPC)' : '🌐 Web Browser (HTTP)'}
        {!API_CONFIG.isTauri && (
          <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
            API Server: {API_CONFIG.apiBaseUrl}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          border: '2px solid #f44336',
          borderRadius: '4px',
          color: '#c62828'
        }}>
          {error}
        </div>
      )}

      {/* Greet API */}
      <div style={{ marginBottom: '30px' }}>
        <h3>1. Greet API</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            style={{ padding: '8px', fontSize: '14px' }}
          />
          <button onClick={handleGreet} disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? 'Loading...' : 'Greet'}
          </button>
        </div>
        {greeting && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Response:</strong> {greeting}
          </div>
        )}
      </div>

      {/* Get Trades API */}
      <div style={{ marginBottom: '30px' }}>
        <h3>2. Get Trades API</h3>
        <button onClick={handleGetTrades} disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Loading...' : 'Get Trades'}
        </button>
        {trades.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Symbol</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Quantity</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Price</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{trade.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{trade.symbol}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{trade.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>${trade.price}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{trade.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Get Market Data API */}
      <div style={{ marginBottom: '30px' }}>
        <h3>3. Get Market Data API</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleGetMarketData('AAPL')} disabled={loading} style={{ padding: '8px 16px' }}>
            AAPL
          </button>
          <button onClick={() => handleGetMarketData('GOOGL')} disabled={loading} style={{ padding: '8px 16px' }}>
            GOOGL
          </button>
        </div>
        {marketData && (
          <div style={{ marginTop: '10px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <div><strong>Symbol:</strong> {marketData.symbol}</div>
            <div><strong>Price:</strong> ${marketData.price}</div>
            <div><strong>Change:</strong> <span style={{ color: marketData.change >= 0 ? 'green' : 'red' }}>
              {marketData.change >= 0 ? '+' : ''}{marketData.change}
            </span></div>
            <div><strong>Volume:</strong> {marketData.volume.toLocaleString()}</div>
          </div>
        )}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3e0',
        border: '1px solid #ff9800',
        borderRadius: '4px'
      }}>
        <strong>💡 Tip:</strong> This component uses the same API client code in both Tauri desktop and web modes!
        The client automatically detects the environment and uses IPC or HTTP accordingly.
      </div>
    </div>
  );
}
