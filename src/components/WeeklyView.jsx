import { CATEGORY_ICONS, CATEGORY_COLORS } from "../App";

function getWeekRange(offset = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function formatDateRange(monday, sunday) {
  const opts = { day: "numeric", month: "short" };
  return `${monday.toLocaleDateString("en-IN", opts)} – ${sunday.toLocaleDateString("en-IN", opts)}`;
}

function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short" });
}

function WeekSection({ title, subtitle, expenses, highlight }) {
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className={`card-custom p-4 mb-3 ${highlight ? "week-highlight" : ""}`}>
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div>
          <h6 className="fw-bold mb-0">{title}</h6>
          <small className="text-muted">{subtitle}</small>
        </div>
        <div className="text-end">
          <p
            className="fw-bold mb-0"
            style={{ color: total > 0 ? "#ef4444" : "#10b981", fontSize: "1.1rem" }}
          >
            ₹{total.toFixed(2)}
          </p>
          <small className="text-muted">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</small>
        </div>
      </div>

      <hr style={{ borderColor: "#e2e8f0" }} />

      {!expenses.length ? (
        <p className="text-muted small text-center py-2">
          😌 No expenses this week — well done!
        </p>
      ) : (
        sorted.map((exp) => (
          <div
            key={exp.id}
            className="d-flex align-items-center gap-3 mb-2 pb-2"
            style={{ borderBottom: "1px solid #f1f5f9" }}
          >
            {/* Day badge */}
            <div className="day-badge">{getDayName(exp.date)}</div>

            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: (CATEGORY_COLORS[exp.category] || "#6b7280") + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              {CATEGORY_ICONS[exp.category] || "📦"}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="mb-0" style={{ fontSize: 14, fontWeight: 600 }}>
                {exp.title}
              </p>
              <small style={{ color: CATEGORY_COLORS[exp.category] || "#6b7280" }}>
                {exp.category}
              </small>
            </div>

            <span style={{ fontWeight: 700, color: "#ef4444", fontSize: 14 }}>
              ₹{parseFloat(exp.amount).toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default function WeeklyView({ expenses }) {
  const { monday: curMon, sunday: curSun } = getWeekRange(0);
  const { monday: prevMon, sunday: prevSun } = getWeekRange(-1);

  const thisWeek = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= curMon && d <= curSun;
  });

  const prevWeek = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= prevMon && d <= prevSun;
  });

  const thisTotal = thisWeek.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const prevTotal = prevWeek.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  const diff = thisTotal - prevTotal;
  const diffPercent = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(0) : null;

  return (
    <div>
      {/* Comparison badge */}
      {prevTotal > 0 && (
        <div
          className={`week-compare-banner mb-3 ${diff > 0 ? "up" : "down"}`}
        >
          {diff > 0
            ? `📈 This week you spent ₹${Math.abs(diff).toFixed(0)} more (+${diffPercent}%) than last week`
            : `📉 This week you spent ₹${Math.abs(diff).toFixed(0)} less (${diffPercent}%) than last week — great job! 🎉`}
        </div>
      )}

      <WeekSection
        title="📅 This Week"
        subtitle={formatDateRange(curMon, curSun)}
        expenses={thisWeek}
        highlight={true}
      />
      <WeekSection
        title="⏮ Previous Week"
        subtitle={formatDateRange(prevMon, prevSun)}
        expenses={prevWeek}
        highlight={false}
      />
    </div>
  );
}
