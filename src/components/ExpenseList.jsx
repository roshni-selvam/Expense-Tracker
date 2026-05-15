import { useState } from "react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../App";

export default function ExpenseList({ expenses, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (!expenses.length) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: "2.5rem" }}>🧾</div>
        <p className="mt-2 fw-semibold">No expenses found</p>
        <small>Add one from the form or change the filter!</small>
      </div>
    );
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted small">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</span>
        <span className="fw-bold" style={{ color: "#ef4444" }}>
          Total: ₹{total.toFixed(2)}
        </span>
      </div>

      <div className="expense-list">
        {sorted.map((exp) => (
          <div
            key={exp.id}
            className={`expense-item ${deletingId === exp.id ? "deleting" : ""}`}
          >
            <div
              className="expense-icon"
              style={{
                background: (CATEGORY_COLORS[exp.category] || "#6b7280") + "18",
              }}
            >
              {CATEGORY_ICONS[exp.category] || "📦"}
            </div>

            <div className="expense-info">
              <p className="expense-title">{exp.title}</p>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span
                  className="expense-cat"
                  style={{
                    background: (CATEGORY_COLORS[exp.category] || "#6b7280") + "20",
                    color: CATEGORY_COLORS[exp.category] || "#6b7280",
                  }}
                >
                  {CATEGORY_ICONS[exp.category]} {exp.category}
                </span>
                <span className="expense-date">
                  {new Date(exp.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="expense-right">
              <p className="expense-amount">₹{parseFloat(exp.amount).toFixed(2)}</p>
              <button
                className="btn-delete"
                onClick={() => handleDelete(exp.id)}
                disabled={deletingId === exp.id}
                title="Delete"
              >
                {deletingId === exp.id ? "..." : "🗑"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
