import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

export default function ExpectedVsActualChart({ curve = [] }) {
  if (!curve || curve.length === 0) return null;

  return (
    <div className="hud-card" style={{ marginBottom: 20 }}>
      <div className="hud-title" style={{ justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={16} /> Live Generation Curve: Expected vs Actual
        </span>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          HOURLY TELEMETRY PROFILE
        </span>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ffaa00" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
            <XAxis dataKey="hour" stroke="var(--text-muted)" tick={{ fontSize: 11, fill: "var(--text-dim)" }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11, fill: "var(--text-dim)" }} unit="kW" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#050a14",
                borderColor: "var(--neon-cyan)",
                borderRadius: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "#fff"
              }}
            />

            {/* Expected Curve */}
            <Area
              type="monotone"
              dataKey="expected"
              name="Expected (Clear Sky)"
              stroke="#00f0ff"
              strokeDasharray="4 4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expectedGrad)"
            />

            {/* Actual Generation */}
            <Area
              type="monotone"
              dataKey="generation"
              name="Actual Generation"
              stroke="#ffaa00"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#actualGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
