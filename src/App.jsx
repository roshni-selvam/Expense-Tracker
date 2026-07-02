import { useState, useEffect, useCallback } from "react";
import { getExpenses, addExpense, deleteExpense } from "./api/ExpenseApi";

import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import CategoryFilter from "./components/CategoryFilter";
import SummaryChart from "./components/SummaryChart";
import WeeklyView from "./components/WeeklyView";
import BudgetAlert from "./components/BudgetAlert";

import "./App.css";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Others",
];

export const CATEGORY_ICONS = {
  Food: "🍕",
  Transport: "🚗",
  Shopping: "🛒",
  Bills: "💡",
  Entertainment: "🎮",
  Health: "💊",
  Others: "📦",
};

export const CATEGORY_COLORS = {
  Food: "#10b981",
  Transport: "#3b82f6",
  Shopping: "#f59e0b",
  Bills: "#ef4444",
  Entertainment: "#8b5cf6",
  Health: "#ec4899",
  Others: "#6b7280",
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("expenses");

  const [budget, setBudget] = useState(
    () => parseFloat(localStorage.getItem("monthlyBudget")) || 0
  );

  const fetchExpenses = useCallback(async () => {
    const data = await getExpenses();
    setExpenses(data);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async (expense) => {
    const added = await addExpense(expense);
    setExpenses((prev) => [...prev, added]);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleBudgetChange = (val) => {
    setBudget(val);
    localStorage.setItem("monthlyBudget", val);
  };

  const now = new Date();

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);

    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  const totalAll = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  return (
    <div className="app-wrapper">

      <header className="app-header">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between flex-wrap gap-3">

            <div>
              <h1 className="app-title">💸 SpendSmart</h1>
              <p className="app-subtitle">
                Track · Filter · Save
              </p>
            </div>

            <div className="d-flex gap-3 flex-wrap">

              <div className="stat-chip">
                <span className="stat-label">
                  This Month
                </span>

                <span className="stat-value danger">
                  ₹{totalThisMonth.toFixed(2)}
                </span>
              </div>

              <div className="stat-chip">
                <span className="stat-label">
                  All Time
                </span>

                <span className="stat-value">
                  ₹{totalAll.toFixed(2)}
                </span>
              </div>

            </div>
          </div>
        </div>
      </header>

      <div className="container-fluid px-4 py-4">

        <BudgetAlert
          totalSpent={totalThisMonth}
          budget={budget}
          onBudgetChange={handleBudgetChange}
        />

        <div className="row g-4 mt-1">

          <div className="col-lg-4">
            <AddExpenseForm onAdd={handleAdd} />
          </div>

          <div className="col-lg-8">

            <div className="tab-bar mb-3">

              <button
                className={`tab-btn ${
                  activeTab === "expenses" ? "active" : ""
                }`}
                onClick={() => setActiveTab("expenses")}
              >
                📋 Expenses
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "weekly" ? "active" : ""
                }`}
                onClick={() => setActiveTab("weekly")}
              >
                📅 Weekly
              </button>

              <button
                className={`tab-btn ${
                  activeTab === "chart" ? "active" : ""
                }`}
                onClick={() => setActiveTab("chart")}
              >
                📊 Chart
              </button>

            </div>

            {activeTab === "expenses" && (
              <>
                <CategoryFilter
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />

                <ExpenseList
                  expenses={filteredExpenses}
                  onDelete={handleDelete}
                />
              </>
            )}

            {activeTab === "weekly" && (
              <WeeklyView expenses={expenses} />
            )}

            {activeTab === "chart" && (
              <SummaryChart expenses={thisMonthExpenses} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;