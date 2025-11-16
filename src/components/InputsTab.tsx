import { useState } from "react";

function InputsTab() {
  const [formData, setFormData] = useState({
    symbol: "",
    orderType: "market",
    side: "buy",
    quantity: "",
    price: "",
    stopPrice: "",
    timeInForce: "day",
    account: "PRIMARY",
  });

  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      status: "PENDING",
    };
    setOrders([newOrder, ...orders]);
    // Reset form
    setFormData({
      ...formData,
      symbol: "",
      quantity: "",
      price: "",
      stopPrice: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "16px", color: "#ff8c00" }}>ORDER ENTRY</h2>

      <form className="input-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>SYMBOL</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g., AAPL"
              required
            />
          </div>
          <div className="form-group">
            <label>ACCOUNT</label>
            <select name="account" value={formData.account} onChange={handleChange}>
              <option value="PRIMARY">PRIMARY</option>
              <option value="SECONDARY">SECONDARY</option>
              <option value="MARGIN">MARGIN</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SIDE</label>
            <select name="side" value={formData.side} onChange={handleChange}>
              <option value="buy">BUY</option>
              <option value="sell">SELL</option>
            </select>
          </div>
          <div className="form-group">
            <label>ORDER TYPE</label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
            >
              <option value="market">MARKET</option>
              <option value="limit">LIMIT</option>
              <option value="stop">STOP</option>
              <option value="stop-limit">STOP LIMIT</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>QUANTITY</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
          <div className="form-group">
            <label>LIMIT PRICE</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              disabled={formData.orderType === "market"}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>STOP PRICE</label>
            <input
              type="number"
              step="0.01"
              name="stopPrice"
              value={formData.stopPrice}
              onChange={handleChange}
              placeholder="0.00"
              disabled={
                formData.orderType !== "stop" &&
                formData.orderType !== "stop-limit"
              }
            />
          </div>
          <div className="form-group">
            <label>TIME IN FORCE</label>
            <select
              name="timeInForce"
              value={formData.timeInForce}
              onChange={handleChange}
            >
              <option value="day">DAY</option>
              <option value="gtc">GTC (Good Till Cancel)</option>
              <option value="ioc">IOC (Immediate or Cancel)</option>
              <option value="fok">FOK (Fill or Kill)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-button">
          SUBMIT ORDER
        </button>
      </form>

      {orders.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ marginBottom: "12px", color: "#ff8c00" }}>
            PENDING ORDERS
          </h3>
          <table className="data-grid">
            <thead>
              <tr>
                <th>TIME</th>
                <th>SYMBOL</th>
                <th>SIDE</th>
                <th>TYPE</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ color: "#888888" }}>{order.timestamp}</td>
                  <td style={{ color: "#ff8c00", fontWeight: "bold" }}>
                    {order.symbol}
                  </td>
                  <td
                    className={order.side === "buy" ? "positive" : "negative"}
                    style={{ textTransform: "uppercase" }}
                  >
                    {order.side}
                  </td>
                  <td style={{ color: "#cccccc", textTransform: "uppercase" }}>
                    {order.orderType}
                  </td>
                  <td style={{ color: "#ffffff" }}>{order.quantity}</td>
                  <td style={{ color: "#ffffff" }}>
                    {order.price || "MARKET"}
                  </td>
                  <td className="neutral">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InputsTab;
