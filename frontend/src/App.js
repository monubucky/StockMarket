import React, { useState, useEffect } from "react";
import { fetchStock } from "./api";
import StockChart from "./Chart";

export default function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState(null);
  const [interval, setIntervalValue] = useState("1m");

  const loadData = async () => {
    try {
      const result = await fetchStock(symbol, interval);
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, [symbol, interval]);

  return (
    <div style={{ background: "#0d1117", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1>📈 Stock Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter symbol..."
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button onClick={loadData} style={{ marginLeft: "10px", padding: "10px" }}>
          Load
        </button>
      </div>

      <div>
        {["1m", "5m", "15m", "1h", "1d"].map((i) => (
          <button
            key={i}
            onClick={() => setIntervalValue(i)}
            style={{
              marginRight: "10px",
              padding: "8px",
              background: interval === i ? "#238636" : "#30363d",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {i}
          </button>
        ))}
      </div>

      {data && (
        <>
          <h2>{data.symbol}</h2>
          <p>Price: {data.price}</p>
          <p>SMA14: {data.sma14 ?? "Loading..."}</p>
          <p>RSI14: {data.rsi14 ?? "Loading..."}</p>

          <StockChart history={data.history} timestamps={data.timestamps} />
        </>
      )}
    </div>
  );
}