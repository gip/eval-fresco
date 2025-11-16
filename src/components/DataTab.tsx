import { useState, useEffect } from "react";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
  open: number;
}

function DataTab() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: "AAPL",
      price: 178.45,
      change: 2.34,
      changePercent: 1.33,
      volume: "52.3M",
      high: 179.12,
      low: 176.89,
      open: 177.20,
    },
    {
      symbol: "GOOGL",
      price: 142.87,
      change: -0.89,
      changePercent: -0.62,
      volume: "28.7M",
      high: 144.23,
      low: 142.15,
      open: 143.75,
    },
    {
      symbol: "MSFT",
      price: 412.33,
      change: 5.67,
      changePercent: 1.39,
      volume: "31.2M",
      high: 413.45,
      low: 408.90,
      open: 409.50,
    },
    {
      symbol: "AMZN",
      price: 178.92,
      change: -1.23,
      changePercent: -0.68,
      volume: "45.8M",
      high: 180.45,
      low: 177.80,
      open: 179.85,
    },
    {
      symbol: "TSLA",
      price: 234.56,
      change: 8.92,
      changePercent: 3.95,
      volume: "98.5M",
      high: 236.78,
      low: 228.45,
      open: 229.30,
    },
    {
      symbol: "META",
      price: 478.23,
      change: -3.45,
      changePercent: -0.72,
      volume: "18.9M",
      high: 482.90,
      low: 476.12,
      open: 481.50,
    },
    {
      symbol: "NVDA",
      price: 495.67,
      change: 12.34,
      changePercent: 2.55,
      volume: "42.3M",
      high: 497.89,
      low: 488.45,
      open: 490.20,
    },
    {
      symbol: "JPM",
      price: 198.45,
      change: 1.87,
      changePercent: 0.95,
      volume: "12.4M",
      high: 199.23,
      low: 197.12,
      open: 197.80,
    },
  ]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prevData) =>
        prevData.map((stock) => {
          const priceChange = (Math.random() - 0.5) * 2;
          const newPrice = stock.price + priceChange;
          const newChange = stock.change + priceChange;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? "+" : "";
    const className = change >= 0 ? "positive" : "negative";
    return (
      <span className={className}>
        {sign}
        {change.toFixed(2)} ({sign}
        {percent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "#ff8c00" }}>
        MARKET DATA - REAL-TIME
      </h2>
      <table className="data-grid">
        <thead>
          <tr>
            <th>SYMBOL</th>
            <th>LAST PRICE</th>
            <th>CHANGE</th>
            <th>VOLUME</th>
            <th>OPEN</th>
            <th>HIGH</th>
            <th>LOW</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((stock) => (
            <tr key={stock.symbol}>
              <td style={{ color: "#ff8c00", fontWeight: "bold" }}>
                {stock.symbol}
              </td>
              <td style={{ color: "#ffffff" }}>${stock.price.toFixed(2)}</td>
              <td>{formatChange(stock.change, stock.changePercent)}</td>
              <td style={{ color: "#cccccc" }}>{stock.volume}</td>
              <td style={{ color: "#cccccc" }}>${stock.open.toFixed(2)}</td>
              <td style={{ color: "#cccccc" }}>${stock.high.toFixed(2)}</td>
              <td style={{ color: "#cccccc" }}>${stock.low.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTab;
