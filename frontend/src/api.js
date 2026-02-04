export async function fetchStock(symbol, interval = "1m") {
  const res = await fetch(`http://localhost:8000/stock/${symbol}?interval=${interval}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}