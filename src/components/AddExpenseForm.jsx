import { useState } from "react";
import { CATEGORIES } from "../App";

const today = new Date().toISOString().split("T")[0];

export default function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: today,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    if (parseFloat(form.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onAdd({ ...form, amount: parseFloat(form.amount) });
      setForm({ title: "", amount: "", category: "Food", date: today });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Add pannavillai. Retry pannunga!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-custom p-4">
      <h5 className="fw-bold mb-1">➕ Add Expense</h5>
      <p className="text-muted small mb-4">New expense record create pannunga</p>

      {success && (
        <div className="alert-custom alert-success-custom mb-3">
          ✅ Expense added successfully!
        </div>
      )}
      {error && (
        <div className="alert-custom alert-danger-custom mb-3">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium">Title</label>
          <input
            type="text"
            className="form-control custom-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Lunch, Uber, Netflix..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Amount (₹)</label>
          <div className="input-group">
            <span className="input-group-text custom-addon">₹</span>
            <input
              type="number"
              className="form-control custom-input"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Category</label>
          <select
            className="form-select custom-input"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">Date</label>
          <input
            type="date"
            className="form-control custom-input"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-add w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Adding...
            </>
          ) : (
            "Add Expense"
          )}
        </button>
      </form>
    </div>
  );
}
