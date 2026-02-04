import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function StockChart({ history, timestamps }) {
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: "Price",
        data: history,
        borderColor: "#58a6ff",
        backgroundColor: "rgba(88, 166, 255, 0.2)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      duration: 800,
      easing: "easeInOutQuart"
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } }
    },
    plugins: {
      legend: { labels: { color: "white" } }
    }
  };

  return <Line data={data} options={options} />;
}