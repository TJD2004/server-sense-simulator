import React from "react";
import { Sun, Home, Battery, Zap, ShieldCheck, Cpu, Flame, Gauge } from "lucide-react";

export default function LiveTelemetryGrid({ live, healthScore = 100 }) {
  if (!live) return null;

  const solar = live.solar ?? 0;
  const home = live.home ?? 0;
  const battery = live.battery ?? 50;
  const gridNet = live.gridNet ?? (solar - home);
  const efficiency = live.efficiency ?? 96.5;

  const getHealthColor = (score) => {
    if (score >= 85) return "var(--neon-green)";
    if (score >= 60) return "var(--neon-amber)";
    return "var(--neon-red)";
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
      {/* Solar Generation */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(255, 170, 0, 0.15)", border: "1px solid var(--neon-amber)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Sun size={20} color="var(--neon-amber)" />
        </div>
        <div>
          <div className="metric-title">Solar Generation</div>
          <div className="metric-val" style={{ color: "var(--neon-amber)" }}>
            {solar.toFixed(2)} <span style={{ fontSize: 11, color: "var(--text-muted)" }}>kW</span>
          </div>
        </div>
      </div>

      {/* Home Consumption */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(0, 240, 255, 0.15)", border: "1px solid var(--neon-cyan)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Home size={20} color="var(--neon-cyan)" />
        </div>
        <div>
          <div className="metric-title">Home Consumption</div>
          <div className="metric-val" style={{ color: "var(--neon-cyan)" }}>
            {home.toFixed(2)} <span style={{ fontSize: 11, color: "var(--text-muted)" }}>kW</span>
          </div>
        </div>
      </div>

      {/* Battery State */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(0, 255, 136, 0.15)", border: "1px solid var(--neon-green)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Battery size={20} color="var(--neon-green)" />
        </div>
        <div>
          <div className="metric-title">Battery Charge</div>
          <div className="metric-val" style={{ color: "var(--neon-green)" }}>
            {battery}%
          </div>
        </div>
      </div>

      {/* Grid Flow */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: gridNet >= 0 ? "rgba(0, 255, 136, 0.15)" : "rgba(255, 51, 102, 0.15)",
          border: `1px solid ${gridNet >= 0 ? "var(--neon-green)" : "var(--neon-red)"}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Zap size={20} color={gridNet >= 0 ? "var(--neon-green)" : "var(--neon-red)"} />
        </div>
        <div>
          <div className="metric-title">Grid Net Flow</div>
          <div className="metric-val" style={{ color: gridNet >= 0 ? "var(--neon-green)" : "var(--neon-red)" }}>
            {gridNet >= 0 ? `+${gridNet.toFixed(2)}` : gridNet.toFixed(2)} <span style={{ fontSize: 11, color: "var(--text-muted)" }}>kW</span>
          </div>
        </div>
      </div>

      {/* Solar Health Score */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${getHealthColor(healthScore)}22`,
          border: `1px solid ${getHealthColor(healthScore)}`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ShieldCheck size={20} color={getHealthColor(healthScore)} />
        </div>
        <div>
          <div className="metric-title">Solar Health Score</div>
          <div className="metric-val" style={{ color: getHealthColor(healthScore) }}>
            {healthScore}<span style={{ fontSize: 11, color: "var(--text-muted)" }}>/100</span>
          </div>
        </div>
      </div>

      {/* Efficiency */}
      <div className="metric-box">
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "rgba(176, 38, 255, 0.15)", border: "1px solid var(--neon-purple)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Gauge size={20} color="var(--neon-purple)" />
        </div>
        <div>
          <div className="metric-title">Inverter Efficiency</div>
          <div className="metric-val" style={{ color: "var(--neon-purple)" }}>
            {efficiency}%
          </div>
        </div>
      </div>
    </div>
  );
}
