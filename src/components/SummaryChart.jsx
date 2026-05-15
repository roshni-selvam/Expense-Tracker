import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useState } from "react";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../App";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].payload.name}</p>
        <p style={{ margin: 0, color: "#10b981", fontWeight: 700 }}>
          ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function SummaryChart({ expenses }) {
  const [chartType, setChartType] = useState("bar");

  const data = CATEGORIES.map((cat) => ({
    name: `${CATEGORY_ICONS[cat]} ${cat}`,
    shortName: cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + parseFloat(e.amount || 0), 0),
    color: CATEGORY_COLORS[cat],
  })).filter((d) => d.total > 0);

  const grandTotal = data.reduce((s, d) => s + d.total, 0);

  if (!data.length) {
    return (
      <div className="empty-state card-custom">
        <div style={{ fontSize: "2.5rem" }}>📊</div>
        <p className="mt-2 fw-semibold">No data this month</p>
        <small>Add some expenses to see the chart!</small>
      </div>
    );
  }

  return (
    <div className="card-custom p-4">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-1">Monthly Summary</h5>
          <p className="text-muted small mb-0">
            Total spent:{" "}
            <strong style={{ color: "#ef4444" }}>₹{grandTotal.toFixed(2)}</strong>
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`chart-toggle-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            📊 Bar
          </button>
          <button
            className={`chart-toggle-btn ${chartType === "pie" ? "active" : ""}`}
            onClick={() => setChartType("pie")}
          >
            🥧 Pie
          </button>
        </div>
      </div>

      {chartType === "bar" ? (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 55 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${v}`}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={45}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Breakdown table */}
      <div className="mt-4">
        <p className="fw-semibold small mb-3 text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>
          Breakdown
        </p>
        {data.map((d, i) => (
          <div key={i} className="d-flex align-items-center gap-3 mb-2">
            <span style={{ fontSize: 13, minWidth: 130 }}>{d.name}</span>
            <div
              style={{
                flex: 1,
                height: 8,
                background: "#e5e7eb",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(d.total / grandTotal) * 100}%`,
                  height: "100%",
                  background: d.color,
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, minWidth: 80, textAlign: "right" }}>
              ₹{d.total.toFixed(2)}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 36 }}>
              {((d.total / grandTotal) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
