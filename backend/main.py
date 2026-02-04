from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sma(series, window):
    return series.rolling(window=window).mean()

def rsi(series, window):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

@app.get("/stock/{symbol}")
def get_stock(symbol: str, interval: str = "1m"):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d", interval=interval)

    if data.empty:
        return {"error": "No data returned", "symbol": symbol}

    data["sma14"] = sma(data["Close"], 14)
    data["rsi14"] = rsi(data["Close"], 14)

    latest = data.iloc[-1]

    return {
        "symbol": symbol.upper(),
        "price": float(latest["Close"]),
        "sma14": float(latest["sma14"]) if not pd.isna(latest["sma14"]) else None,
        "rsi14": float(latest["rsi14"]) if not pd.isna(latest["rsi14"]) else None,
        "history": data["Close"].tolist(),
        "timestamps": data.index.strftime("%H:%M").tolist()
    }