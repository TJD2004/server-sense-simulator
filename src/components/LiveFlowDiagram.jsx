import React from "react";
import { Sun, Home, Battery, Zap, Activity } from "lucide-react";

export default function LiveFlowDiagram({ solar = 0, home = 0, battery = 50, grid = 0, battPower = 0, gridNet = 0 }) {
  // Speed calculation: higher power = faster particle flow
  const solarSpeed = solar > 0 ? Math.max(0.4, 2.5 - solar * 0.3) : 0;
  const homeSpeed = home > 0 ? Math.max(0.4, 2.5 - home * 0.3) : 0;
  const battSpeed = Math.abs(battPower) > 0 ? Math.max(0.4, 2.5 - Math.abs(battPower) * 0.3) : 0;
  const gridSpeed = Math.abs(gridNet) > 0 ? Math.max(0.4, 2.5 - Math.abs(gridNet) * 0.3) : 0;

  const isCharging = battPower > 0;
  const isExporting = gridNet >= 0;

  return (
    <div className="hud-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="hud-title" style={{ width: "100%" }}>
        <Activity size={16} /> Interactive Energy Flow Engine
      </div>

      <svg viewBox="0 0 600 240" className="flow-svg">
        <defs>
          <radialGradient id="solarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections Background Tracks */}
        <path d="M 300 35 L 300 110" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="3" fill="none" />
        <path d="M 300 110 L 120 185" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="3" fill="none" />
        <path d="M 300 110 L 300 185" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="3" fill="none" />
        <path d="M 300 110 L 480 185" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="3" fill="none" />

        {/* Animated Flow Lines */}
        {solar > 0 && (
          <path
            d="M 300 35 L 300 110"
            stroke="var(--neon-amber)"
            strokeWidth="3.5"
            fill="none"
            className="pulse-line"
            style={{ animationDuration: `${solarSpeed}s`, filter: "url(#neonGlow)" }}
          />
        )}

        {home > 0 && (
          <path
            d="M 300 110 L 120 185"
            stroke="var(--neon-cyan)"
            strokeWidth="3.5"
            fill="none"
            className="pulse-line"
            style={{ animationDuration: `${homeSpeed}s`, filter: "url(#neonGlow)" }}
          />
        )}

        {Math.abs(battPower) > 0 && (
          <path
            d={isCharging ? "M 300 110 L 300 185" : "M 300 185 L 300 110"}
            stroke="var(--neon-green)"
            strokeWidth="3.5"
            fill="none"
            className="pulse-line"
            style={{ animationDuration: `${battSpeed}s`, filter: "url(#neonGlow)" }}
          />
        )}

        {Math.abs(gridNet) > 0 && (
          <path
            d={isExporting ? "M 300 110 L 480 185" : "M 480 185 L 300 110"}
            stroke={isExporting ? "var(--neon-green)" : "var(--neon-red)"}
            strokeWidth="3.5"
            fill="none"
            className="pulse-line"
            style={{ animationDuration: `${gridSpeed}s`, filter: "url(#neonGlow)" }}
          />
        )}

        {/* NODES */}

        {/* Sun Node */}
        <g transform="translate(300, 35)">
          <circle r="26" fill="url(#solarGlow)" />
          <circle r="18" fill="#050a14" stroke="var(--neon-amber)" strokeWidth="2" />
          <foreignObject x="-10" y="-10" width="20" height="20">
            <Sun size={20} color="var(--neon-amber)" />
          </foreignObject>
        </g>
        <text x="316" y="70" fill="var(--neon-amber)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700">
          +{solar.toFixed(2)} kW
        </text>

        {/* Inverter Node */}
        <g transform="translate(300, 110)">
          <circle r="22" fill="#050a14" stroke="var(--neon-cyan)" strokeWidth="2.5" className="flow-node-glow" />
          <text textAnchor="middle" dy="4" fill="var(--neon-cyan)" fontFamily="var(--font-title)" fontSize="10" fontWeight="900">
            INV
          </text>
        </g>

        {/* Home Node */}
        <g transform="translate(120, 185)">
          <circle r="22" fill="#050a14" stroke="var(--neon-cyan)" strokeWidth="2" />
          <foreignObject x="-10" y="-10" width="20" height="20">
            <Home size={20} color="var(--neon-cyan)" />
          </foreignObject>
        </g>
        <text x="120" y="222" textAnchor="middle" fill="var(--neon-cyan)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700">
          {home.toFixed(2)} kW
        </text>

        {/* Battery Node */}
        <g transform="translate(300, 185)">
          <circle r="22" fill="#050a14" stroke="var(--neon-green)" strokeWidth="2" />
          <foreignObject x="-10" y="-10" width="20" height="20">
            <Battery size={20} color="var(--neon-green)" />
          </foreignObject>
        </g>
        <text x="300" y="222" textAnchor="middle" fill="var(--neon-green)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700">
          {battery}% ({battPower >= 0 ? "+" : ""}{battPower.toFixed(2)} kW)
        </text>

        {/* Grid Node */}
        <g transform="translate(480, 185)">
          <circle r="22" fill="#050a14" stroke={isExporting ? "var(--neon-green)" : "var(--neon-red)"} strokeWidth="2" />
          <foreignObject x="-10" y="-10" width="20" height="20">
            <Zap size={20} color={isExporting ? "var(--neon-green)" : "var(--neon-red)"} />
          </foreignObject>
        </g>
        <text x="480" y="222" textAnchor="middle" fill={isExporting ? "var(--neon-green)" : "var(--neon-red)"} fontFamily="var(--font-mono)" fontSize="12" fontWeight="700">
          {isExporting ? `EXPORT ${gridNet.toFixed(2)}` : `IMPORT ${Math.abs(gridNet).toFixed(2)}`} kW
        </text>
      </svg>
    </div>
  );
}
