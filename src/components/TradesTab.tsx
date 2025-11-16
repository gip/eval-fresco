interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  total: number;
  pnl: number;
  status: string;
}

function TradesTab() {
  const trades: Trade[] = [
    {
      id: 1001,
      timestamp: "09:30:15",
      symbol: "AAPL",
      side: "BUY",
      quantity: 500,
      price: 177.20,
      total: 88600.0,
      pnl: 625.0,
      status: "FILLED",
    },
    {
      id: 1002,
      timestamp: "09:45:32",
      symbol: "GOOGL",
      side: "BUY",
      quantity: 200,
      price: 143.75,
      total: 28750.0,
      pnl: -176.0,
      status: "FILLED",
    },
    {
      id: 1003,
      timestamp: "10:12:08",
      symbol: "MSFT",
      side: "BUY",
      quantity: 300,
      price: 409.50,
      total: 122850.0,
      pnl: 849.0,
      status: "FILLED",
    },
    {
      id: 1004,
      timestamp: "10:35:44",
      symbol: "TSLA",
      side: "SELL",
      quantity: 150,
      price: 229.30,
      total: 34395.0,
      pnl: 1338.0,
      status: "FILLED",
    },
    {
      id: 1005,
      timestamp: "11:02:19",
      symbol: "NVDA",
      side: "BUY",
      quantity: 100,
      price: 490.20,
      total: 49020.0,
      pnl: 547.0,
      status: "FILLED",
    },
    {
      id: 1006,
      timestamp: "11:28:55",
      symbol: "META",
      side: "SELL",
      quantity: 75,
      price: 481.50,
      total: 36112.5,
      pnl: -258.75,
      status: "FILLED",
    },
    {
      id: 1007,
      timestamp: "13:15:33",
      symbol: "AMZN",
      side: "BUY",
      quantity: 250,
      price: 179.85,
      total: 44962.5,
      pnl: -307.5,
      status: "FILLED",
    },
    {
      id: 1008,
      timestamp: "14:42:11",
      symbol: "JPM",
      side: "BUY",
      quantity: 400,
      price: 197.80,
      total: 79120.0,
      pnl: 260.0,
      status: "FILLED",
    },
    {
      id: 1009,
      timestamp: "15:20:47",
      symbol: "AAPL",
      side: "SELL",
      quantity: 300,
      price: 178.45,
      total: 53535.0,
      pnl: 375.0,
      status: "FILLED",
    },
    {
      id: 1010,
      timestamp: "15:55:22",
      symbol: "NVDA",
      side: "SELL",
      quantity: 50,
      price: 495.67,
      total: 24783.5,
      pnl: 273.5,
      status: "PARTIAL",
    },
  ];

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalVolume = trades.reduce((sum, trade) => sum + trade.total, 0);
  const winningTrades = trades.filter((t) => t.pnl > 0).length;
  const losingTrades = trades.filter((t) => t.pnl < 0).length;
  const winRate = (winningTrades / trades.length) * 100;

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "rgb(237, 165, 87)" }}>
        TRADE HISTORY - TODAY
      </h2>

      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-label">TOTAL P&L</div>
          <div
            className="stat-value"
            style={{ color: totalPnL >= 0 ? "#00ff00" : "#ff0000" }}
          >
            ${totalPnL.toFixed(2)}
          </div>
          <div
            className="stat-change"
            style={{ color: totalPnL >= 0 ? "#00ff00" : "#ff0000" }}
          >
            {totalPnL >= 0 ? "▲" : "▼"}{" "}
            {Math.abs((totalPnL / totalVolume) * 100).toFixed(2)}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">TOTAL VOLUME</div>
          <div className="stat-value">${totalVolume.toLocaleString()}</div>
          <div className="stat-change" style={{ color: "#888888" }}>
            {trades.length} trades
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">WIN RATE</div>
          <div className="stat-value">{winRate.toFixed(1)}%</div>
          <div className="stat-change" style={{ color: "#888888" }}>
            {winningTrades}W / {losingTrades}L
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">AVG TRADE SIZE</div>
          <div className="stat-value">
            ${(totalVolume / trades.length).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="stat-change" style={{ color: "#888888" }}>
            per trade
          </div>
        </div>
      </div>

      <table className="data-grid">
        <thead>
          <tr>
            <th>ID</th>
            <th>TIME</th>
            <th>SYMBOL</th>
            <th>SIDE</th>
            <th>QTY</th>
            <th>PRICE</th>
            <th>TOTAL</th>
            <th>P&L</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td style={{ color: "#888888" }}>#{trade.id}</td>
              <td style={{ color: "#888888" }}>{trade.timestamp}</td>
              <td style={{ color: "rgb(237, 165, 87)", fontWeight: "bold" }}>
                {trade.symbol}
              </td>
              <td
                className={trade.side === "BUY" ? "positive" : "negative"}
                style={{ fontWeight: "bold" }}
              >
                {trade.side}
              </td>
              <td style={{ color: "#ffffff" }}>{trade.quantity}</td>
              <td style={{ color: "#ffffff" }}>${trade.price.toFixed(2)}</td>
              <td style={{ color: "#ffffff" }}>
                ${trade.total.toLocaleString()}
              </td>
              <td className={trade.pnl >= 0 ? "positive" : "negative"}>
                ${Math.abs(trade.pnl).toFixed(2)}
                {trade.pnl >= 0 ? " ▲" : " ▼"}
              </td>
              <td
                className={trade.status === "FILLED" ? "positive" : "neutral"}
              >
                {trade.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TradesTab;
