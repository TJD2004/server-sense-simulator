import React from "react";
import { AlertTriangle, Brain, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AIDetectiveAlert({ anomalyActive, scenario, healthScore, curve = [] }) {
  if (!scenario) return null;

  const totalExpected = curve.reduce((s, p) => s + (p.expected || 0), 0);
  const totalActual = curve.reduce((s, p) => s + (p.generation || 0), 0);
  const shortfallPct = totalExpected > 0 ? Math.max(0, Math.round((1 - totalActual / totalExpected) * 100)) : 0;

  const isWarning = anomalyActive || shortfallPct > 15;

  return (
    <div className={`hud-card ${isWarning ? "hud-card-alert" : ""}`} style={{ marginBottom: 20 }}>
      {/* Alert Header Banner */}
      {isWarning ? (
        <div className="event-banner" style={{ marginBottom: 14 }}>
          <ShieldAlert size={24} color="var(--neon-red)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#ffffff", fontFamily: "var(--font-title)" }}>
              ⚠️ PRODUCTION ANOMALY DETECTED!
            </div>
            <div style={{ fontSize: 13, color: "var(--neon-red)", fontFamily: "var(--font-hud)" }}>
              Current Output is {shortfallPct}% below expected baseline. Health Score: {healthScore}/100
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, color: "var(--neon-green)" }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-hud)" }}>
            SYSTEM OPERATIONAL: PRODUCTION TRACKING EXPECTED BASELINE
          </span>
        </div>
      )}

      {/* AI Detective Explanation */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(0, 240, 255, 0.12)", border: "1px solid var(--border-cyan)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Brain size={22} color="var(--neon-cyan)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-title)", fontSize: 13, color: "var(--neon-cyan)", marginBottom: 4 }}>
            🤖 AI PERFORMANCE DETECTIVE ANALYSIS
          </div>
          <div style={{ fontSize: 14, color: "var(--text-main)", lineHeight: 1.5, marginBottom: 10 }}>
            {scenario.insight?.body || "Analyzing telemetry streams..."}
          </div>

          {/* Likely Contributors Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(scenario.insight?.tags || []).map((t, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 12,
                  background: "rgba(5, 10, 20, 0.9)",
                  border: "1px solid var(--border-cyan)",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)"
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
