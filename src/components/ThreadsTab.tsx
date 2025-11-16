import { useState } from "react";

interface Message {
  id: number;
  sender: string;
  time: string;
  content: string;
  type: "system" | "user" | "alert";
}

function ThreadsTab() {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: "SYSTEM",
      time: "09:30:00",
      content: "Market opened. All systems operational.",
      type: "system",
    },
    {
      id: 2,
      sender: "TRADER_02",
      time: "09:31:23",
      content:
        "Good morning. Seeing strong volume on NVDA this morning. Recommend increasing position.",
      type: "user",
    },
    {
      id: 3,
      sender: "ANALYST_05",
      time: "09:32:15",
      content:
        "AAPL earnings call scheduled for 4:30 PM. Expect volatility in the afternoon session.",
      type: "user",
    },
    {
      id: 4,
      sender: "RISK_MANAGER",
      time: "09:35:44",
      content:
        "Portfolio delta is within acceptable range. Current exposure: +2.3M.",
      type: "user",
    },
    {
      id: 5,
      sender: "ALERT",
      time: "09:42:17",
      content:
        "PRICE ALERT: TSLA crossed above $235.00. Current price: $235.23 (+3.8%)",
      type: "alert",
    },
    {
      id: 6,
      sender: "TRADER_07",
      time: "09:45:03",
      content:
        "Executing hedge strategy on tech sector. Shorting QQQ to offset long positions.",
      type: "user",
    },
    {
      id: 7,
      sender: "COMPLIANCE",
      time: "09:50:12",
      content:
        "Reminder: Daily position limits in effect. Please review before entering new trades.",
      type: "system",
    },
    {
      id: 8,
      sender: "TRADER_02",
      time: "10:15:33",
      content:
        "META breaking resistance at $480. Could be a good entry point for swing trade.",
      type: "user",
    },
    {
      id: 9,
      sender: "ALERT",
      time: "10:22:45",
      content:
        "VOLUME ALERT: AMZN trading 3x average volume. Unusual activity detected.",
      type: "alert",
    },
    {
      id: 10,
      sender: "DESK_HEAD",
      time: "10:30:00",
      content:
        "Team meeting at 11:00 AM to discuss portfolio rebalancing strategy. All traders please attend.",
      type: "user",
    },
  ]);

  const getMessageStyle = (type: string) => {
    switch (type) {
      case "alert":
        return { borderLeftColor: "#ff0000" };
      case "system":
        return { borderLeftColor: "#ffff00" };
      default:
        return { borderLeftColor: "rgb(237, 165, 87)" };
    }
  };

  const getSenderColor = (type: string) => {
    switch (type) {
      case "alert":
        return "#ff0000";
      case "system":
        return "#ffff00";
      default:
        return "rgb(237, 165, 87)";
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "rgb(237, 165, 87)" }}>
        MESSAGE THREADS - TRADING DESK
      </h2>

      <div className="thread-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className="message"
            style={getMessageStyle(message.type)}
          >
            <div className="message-header">
              <span
                className="message-sender"
                style={{ color: getSenderColor(message.type) }}
              >
                {message.sender}
              </span>
              <span className="message-time">{message.time}</span>
            </div>
            <div className="message-body">{message.content}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px" }}>
        <div className="input-form">
          <div className="form-group">
            <label>COMPOSE MESSAGE</label>
            <input
              type="text"
              placeholder="Type your message to the trading desk..."
              style={{ width: "100%" }}
            />
          </div>
          <button className="submit-button">SEND MESSAGE</button>
        </div>
      </div>
    </div>
  );
}

export default ThreadsTab;
