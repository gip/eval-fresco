interface Strategy {
  id: number;
  name: string;
  status: "active" | "inactive";
  allocation: string;
  pnl: number;
  pnlPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
}

function StrategiesTab() {
  const strategies: Strategy[] = [
    {
      id: 1,
      name: "MOMENTUM BREAKOUT",
      status: "active",
      allocation: "$2.5M",
      pnl: 42350.75,
      pnlPercent: 1.69,
      sharpeRatio: 2.34,
      maxDrawdown: -3.2,
      winRate: 62.5,
      totalTrades: 148,
    },
    {
      id: 2,
      name: "MEAN REVERSION",
      status: "active",
      allocation: "$1.8M",
      pnl: 18920.45,
      pnlPercent: 1.05,
      sharpeRatio: 1.87,
      maxDrawdown: -4.1,
      winRate: 58.3,
      totalTrades: 203,
    },
    {
      id: 3,
      name: "PAIRS TRADING",
      status: "active",
      allocation: "$3.2M",
      pnl: -8450.25,
      pnlPercent: -0.26,
      sharpeRatio: 1.45,
      maxDrawdown: -2.8,
      winRate: 51.2,
      totalTrades: 89,
    },
    {
      id: 4,
      name: "VOLATILITY ARBITRAGE",
      status: "active",
      allocation: "$1.5M",
      pnl: 28760.0,
      pnlPercent: 1.92,
      sharpeRatio: 2.78,
      maxDrawdown: -1.9,
      winRate: 68.7,
      totalTrades: 67,
    },
    {
      id: 5,
      name: "STATISTICAL ARBITRAGE",
      status: "inactive",
      allocation: "$2.0M",
      pnl: 12345.8,
      pnlPercent: 0.62,
      sharpeRatio: 1.23,
      maxDrawdown: -5.4,
      winRate: 54.8,
      totalTrades: 124,
    },
    {
      id: 6,
      name: "TREND FOLLOWING",
      status: "active",
      allocation: "$2.8M",
      pnl: 35678.9,
      pnlPercent: 1.27,
      sharpeRatio: 2.01,
      maxDrawdown: -3.7,
      winRate: 47.3,
      totalTrades: 95,
    },
  ];

  const totalAllocation = strategies.reduce((sum, s) => {
    const value = parseFloat(s.allocation.replace(/[$M,]/g, ""));
    return sum + value;
  }, 0);

  const totalPnL = strategies.reduce((sum, s) => sum + s.pnl, 0);
  const activeStrategies = strategies.filter((s) => s.status === "active").length;

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "#ff8c00" }}>
        STRATEGY MONITOR
      </h2>

      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="stat-card">
          <div className="stat-label">TOTAL ALLOCATION</div>
          <div className="stat-value">${totalAllocation.toFixed(1)}M</div>
          <div className="stat-change" style={{ color: "#888888" }}>
            across {strategies.length} strategies
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">COMBINED P&L</div>
          <div
            className="stat-value"
            style={{ color: totalPnL >= 0 ? "#00ff00" : "#ff0000" }}
          >
            ${totalPnL.toLocaleString()}
          </div>
          <div
            className="stat-change"
            style={{ color: totalPnL >= 0 ? "#00ff00" : "#ff0000" }}
          >
            {totalPnL >= 0 ? "▲" : "▼"}{" "}
            {Math.abs((totalPnL / (totalAllocation * 1000000)) * 100).toFixed(
              2
            )}
            %
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">ACTIVE STRATEGIES</div>
          <div className="stat-value">{activeStrategies}</div>
          <div className="stat-change" style={{ color: "#888888" }}>
            {strategies.length - activeStrategies} inactive
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">BEST PERFORMER</div>
          <div className="stat-value" style={{ fontSize: "16px" }}>
            VOLATILITY ARB
          </div>
          <div className="stat-change" style={{ color: "#00ff00" }}>
            +1.92% ▲
          </div>
        </div>
      </div>

      <div className="strategy-list">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="strategy-card">
            <div className="strategy-header">
              <div className="strategy-name">{strategy.name}</div>
              <div
                className={`strategy-status ${strategy.status}`}
              >
                {strategy.status.toUpperCase()}
              </div>
            </div>

            <div className="strategy-metrics">
              <div className="metric">
                <div className="metric-label">ALLOCATION</div>
                <div className="metric-value">{strategy.allocation}</div>
              </div>
              <div className="metric">
                <div className="metric-label">P&L</div>
                <div
                  className="metric-value"
                  style={{
                    color: strategy.pnl >= 0 ? "#00ff00" : "#ff0000",
                  }}
                >
                  ${strategy.pnl.toLocaleString()}{" "}
                  {strategy.pnl >= 0 ? "▲" : "▼"}
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">RETURN</div>
                <div
                  className="metric-value"
                  style={{
                    color: strategy.pnlPercent >= 0 ? "#00ff00" : "#ff0000",
                  }}
                >
                  {strategy.pnlPercent >= 0 ? "+" : ""}
                  {strategy.pnlPercent.toFixed(2)}%
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">SHARPE RATIO</div>
                <div className="metric-value">{strategy.sharpeRatio.toFixed(2)}</div>
              </div>
              <div className="metric">
                <div className="metric-label">MAX DRAWDOWN</div>
                <div className="metric-value" style={{ color: "#ff0000" }}>
                  {strategy.maxDrawdown.toFixed(1)}%
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">WIN RATE</div>
                <div className="metric-value">
                  {strategy.winRate.toFixed(1)}%
                </div>
              </div>
              <div className="metric">
                <div className="metric-label">TOTAL TRADES</div>
                <div className="metric-value">{strategy.totalTrades}</div>
              </div>
              <div className="metric">
                <div className="metric-label">AVG TRADE</div>
                <div className="metric-value">
                  ${(strategy.pnl / strategy.totalTrades).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StrategiesTab;
