import { useState } from "react";

export default function BudgetAlert({ totalSpent, budget, onBudgetChange }) {
  const [editing, setEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget || "");

  const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const remaining = budget - totalSpent;
  const isOver = budget > 0 && totalSpent >= budget;
  const isWarning = budget > 0 && percentage >= 80 && !isOver;

  const handleSave = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      onBudgetChange(val);
    } else if (tempBudget === "" || val === 0) {
      onBudgetChange(0);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  const barColor = isOver ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981";

  return (
    <div className={`budget-bar ${isOver ? "budget-over" : isWarning ? "budget-warning" : ""}`}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Left: Info */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <p className="mb-0 fw-semibold" style={{ fontSize: 14 }}>
              {isOver
                ? "🚨 Budget Exceeded!"
                : isWarning
                ? "⚠️ Almost at limit!"
                : "💰 Monthly Budget"}
            </p>
            {budget > 0 && (
              <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                Spent ₹{totalSpent.toFixed(2)} of ₹{budget.toFixed(2)}
                {!isOver && (
                  <span style={{ color: "#10b981", fontWeight: 600 }}>
                    {" "}· ₹{remaining.toFixed(2)} remaining
                  </span>
                )}
              </p>
            )}
          </div>
          {budget > 0 && (
            <span
              style={{
                background: barColor + "20",
                color: barColor,
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>

        {/* Right: Edit */}
        <div className="d-flex align-items-center gap-2">
          {editing ? (
            <>
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: 130, borderRadius: 8 }}
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter budget"
                autoFocus
                min="0"
              />
              <button
                className="btn btn-sm"
                style={{
                  background: "#10b981",
                  color: "white",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 600,
                }}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 8 }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: 8, fontSize: 13 }}
              onClick={() => {
                setTempBudget(budget || "");
                setEditing(true);
              }}
            >
              {budget > 0 ? "✏️ Edit Budget" : "➕ Set Monthly Budget"}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {budget > 0 && (
        <div
          style={{
            height: 6,
            background: "#e5e7eb",
            borderRadius: 4,
            overflow: "hidden",
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: barColor,
              borderRadius: 4,
              transition: "width 0.5s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}
