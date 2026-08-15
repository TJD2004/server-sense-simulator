import React from "react";
import { Zap, RotateCcw, Flame, CloudRain, AlertTriangle, Dices, Sun, Cloud } from "lucide-react";

export default function EventTriggerPanel({ onTriggerEvent, onReset, activeEvent }) {
  const events = [
    { id: "sunny", label: "☀️ Sunny Day", color: "var(--neon-amber)", desc: "Clear sky peak generation" },
    { id: "cloud_attack", label: "☁️ Cloud Attack!", color: "#60a5fa", desc: "Sudden 85% cloud blackout" },
    { id: "shading_event", label: "🌳 Shading Event", color: "#4ade80", desc: "Afternoon tree shadow (55% drop)" },
    { id: "dirty_panels", label: "🧹 Dirty Panels", color: "#d97706", desc: "Panel soiling accumulation" },
    { id: "heat_wave", label: "🔥 Heat Wave", color: "var(--neon-red)", desc: "45°C thermal efficiency loss" },
    { id: "rain", label: "🌧️ Heavy Rain", color: "#38bdf8", desc: "90% sky obscurity + wash" },
    { id: "inverter_failure", label: "⚠️ Inverter Failure", color: "var(--neon-red)", desc: "Hardware cliff fault" },
    { id: "random", label: "🎲 Random Event", color: "var(--neon-purple)", desc: "Chaos simulator generator" },
  ];

  return (
    <div className="hud-card">
      <div className="hud-title" style={{ justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} /> Game Scenario Triggers
        </span>
        <button
          className="cyber-btn cyber-btn-amber"
          onClick={onReset}
          style={{ fontSize: 12, padding: "4px 10px" }}
        >
          <RotateCcw size={14} /> ↻ Reset All
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
        {events.map((e) => (
          <button
            key={e.id}
            className={`cyber-btn ${activeEvent === e.id ? "cyber-btn-active" : ""}`}
            onClick={() => onTriggerEvent(e.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 5,
              padding: "12px 16px",
              textAlign: "left",
              width: "100%"
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: e.color }}>{e.label}</span>
            <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "none", opacity: 0.9 }}>{e.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
