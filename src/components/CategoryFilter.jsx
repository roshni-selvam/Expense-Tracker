import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "../App";

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="category-filter mb-3">
      <button
        className={`filter-chip ${selected === "All" ? "active" : ""}`}
        onClick={() => onSelect("All")}
        style={
          selected === "All"
            ? { background: "#10b981", borderColor: "#10b981", color: "white" }
            : {}
        }
      >
        🗂 All
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${selected === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
          style={
            selected === cat
              ? {
                  background: CATEGORY_COLORS[cat],
                  borderColor: CATEGORY_COLORS[cat],
                  color: "white",
                }
              : {}
          }
        >
          {CATEGORY_ICONS[cat]} {cat}
        </button>
      ))}
    </div>
  );
}
