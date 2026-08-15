import React, { useMemo } from "react";
import { Sun, Cloud, CloudRain, Flame, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";

export default function WeatherVisualCanvas({ weather = "sunny", cloudCoverage = 10, temp = 25, shading = 0, soiling = 0, scenarioId = "normal" }) {
  // Generate random rain drops for rainy weather
  const rainDrops = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${0.4 + Math.random() * 0.5}s`,
      delay: `${Math.random() * 2}s`,
      opacity: 0.3 + Math.random() * 0.7,
      height: `${12 + Math.random() * 20}px`,
    }));
  }, []);

  // Generate cloud particles
  const clouds = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${10 + (i % 3) * 20}%`,
      duration: `${15 + i * 5}s`,
      delay: `${-i * 4}s`,
      scale: 0.8 + (i % 3) * 0.3,
    }));
  }, []);

  const isRain = weather === "rainy" || cloudCoverage > 80;
  const isSunny = weather === "sunny" && cloudCoverage < 40;
  const isCloudy = weather === "cloudy" || (cloudCoverage >= 40 && cloudCoverage <= 80);
  const isHeatwave = weather === "heatwave" || temp >= 40;
  const isInverterFault = scenarioId === "inverter";

  return (
    <div className="weather-hero-container">
      {/* Dynamic Sky Background */}
      <div className={`weather-sky-bg sky-${weather}`}>
        {/* ☀️ SUN & RAYS ANIMATION */}
        {isSunny && (
          <div className="sun-container">
            <div className="sun-core" />
            <div className="sun-flare" />
            <div className="sun-rays" />
          </div>
        )}

        {/* ☁️ DRIFTING CLOUDS */}
        {(isCloudy || cloudCoverage > 25) && (
          <div className="clouds-overlay">
            {clouds.slice(0, Math.ceil(cloudCoverage / 15)).map((c) => (
              <div
                key={c.id}
                className="cloud-particle"
                style={{
                  top: c.top,
                  animationDuration: c.duration,
                  animationDelay: c.delay,
                  transform: `scale(${c.scale})`,
                  opacity: Math.min(0.9, cloudCoverage / 100 + 0.2),
                }}
              >
                <Cloud size={90} color="#94a3b8" />
              </div>
            ))}
          </div>
        )}

        {/* 🌧️ FALLING RAIN ANIMATION */}
        {isRain && (
          <div className="rain-container">
            {rainDrops.map((r) => (
              <div
                key={r.id}
                className="raindrop"
                style={{
                  left: r.left,
                  animationDuration: r.duration,
                  animationDelay: r.delay,
                  opacity: r.opacity,
                  height: r.height,
                }}
              />
            ))}
          </div>
        )}

        {/* 🔥 HEATWAVE SHIMMER EFFECT */}
        {isHeatwave && <div className="heatwave-shimmer" />}

        {/* 🌳 SHADING SHADOW OVERLAY */}
        {shading > 0 && (
          <div
            className="shading-tree-shadow"
            style={{ opacity: Math.min(0.85, shading / 100) }}
          >
            <div className="tree-silhouette">🌳 SHADING SHADOW ({shading}%)</div>
          </div>
        )}

        {/* ⚠️ INVERTER SPARK ALERT OVERLAY */}
        {isInverterFault && (
          <div className="inverter-fault-overlay">
            <ShieldAlert size={36} color="var(--neon-red)" className="alert-blink-icon" />
            <span>CRITICAL: INVERTER HARDWARE FAILURE SPARKING</span>
          </div>
        )}

        {/* HUD WEATHER BADGE OVERLAY */}
        <div className="weather-hud-badge">
          {isSunny && <span style={{ color: "var(--neon-amber)" }}><Sun size={14} /> SUNNY CLEAR SKY</span>}
          {isCloudy && <span style={{ color: "var(--text-dim)" }}><Cloud size={14} /> CLOUD COVER ({cloudCoverage}%)</span>}
          {isRain && <span style={{ color: "#60a5fa" }}><CloudRain size={14} /> HEAVY RAINFALL</span>}
          {isHeatwave && <span style={{ color: "var(--neon-red)" }}><Flame size={14} /> HEATWAVE ({temp}°C)</span>}
        </div>
      </div>

      {/* SOLAR PANEL ARRAY VISUAL DISPLAY */}
      <div className="panels-stage">
        <div className="panels-stage-title">SOLAR ARRAY SIMULATOR FEED</div>

        <div className="panels-grid">
          {[1, 2, 3, 4, 5, 6].map((panelId) => {
            const isShadedPanel = shading > 0 && panelId > 3;
            return (
              <div
                key={panelId}
                className={`panel-cell ${isSunny ? "panel-glowing" : ""} ${isShadedPanel ? "panel-shaded" : ""}`}
              >
                {/* Panel Grid Pattern */}
                <div className="panel-grid-lines" />

                {/* Dirt / Soiling Overlay Layer */}
                {soiling > 0 && (
                  <div
                    className="panel-soiling-layer"
                    style={{ opacity: Math.min(0.9, soiling / 100) }}
                  >
                    <span>🧹 DUST ({soiling}%)</span>
                  </div>
                )}

                {/* Raindrops on Panel Surface */}
                {isRain && <div className="panel-rain-drops" />}

                {/* Sunlight Reflection Flare */}
                {isSunny && <div className="panel-sun-flare" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
