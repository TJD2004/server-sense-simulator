import React from "react";
import { Cpu, Activity, Volume2, VolumeX, Trophy, ShieldAlert } from "lucide-react";

export default function ControlRoomHeader({
  connection,
  activeMode,
  setActiveMode,
  soundEnabled,
  setSoundEnabled,
  activeEventName,
}) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
      {/* Brand Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(255, 170, 0, 0.2))",
          border: "1px solid var(--neon-cyan)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px rgba(0, 240, 255, 0.3)"
        }}>
          <Cpu size={24} color="var(--neon-cyan)" />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-title)", fontSize: 20, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffffff" }}>
            SOLARSENSE <span style={{ color: "var(--neon-cyan)" }}>// CONTROL ROOM</span>
          </h1>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            STANDALONE DIGITAL TWIN SIMULATOR • PORT 5174
          </div>
        </div>
      </div>

      {/* Middle Status Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {activeEventName && (
          <div style={{
            background: "rgba(255, 51, 102, 0.15)",
            border: "1px solid var(--neon-red)",
            color: "var(--neon-red)",
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 0 12px rgba(255, 51, 102, 0.3)"
          }}>
            <ShieldAlert size={16} />
            <span>EVENT ACTIVE: {activeEventName}</span>
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(5, 10, 20, 0.8)",
          border: "1px solid var(--border-cyan)",
          padding: "6px 12px",
          borderRadius: 20,
          fontFamily: "var(--font-mono)",
          fontSize: 12
        }}>
          <Activity size={14} color={connection === "live" ? "var(--neon-green)" : "var(--neon-amber)"} />
          <span style={{ color: connection === "live" ? "var(--neon-green)" : "var(--neon-amber)" }}>
            {connection === "live" ? "BACKEND LIVE (PORT 4000)" : "RECONNECTING..."}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="cyber-btn cyber-btn-active">
          <Cpu size={16} /> LIVE CONTROL PANEL
        </div>

        {/* Audio Toggle */}
        <button
          className="cyber-btn"
          style={{ padding: "8px 12px" }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
        >
          {soundEnabled ? <Volume2 size={16} color="var(--neon-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
        </button>
      </div>
    </header>
  );
}
