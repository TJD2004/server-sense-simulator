import React from "react";
import { Sun, Cloud, Thermometer, CloudRain, Shield, Home, Battery, Clock, Zap, Sparkles } from "lucide-react";

export default function EnvironmentSliders({ params, onChangeParam, onWeatherPreset, live }) {
  const currentIrradiance = params.irradiance ?? (live?.irradiance ?? 850);
  return (
    <div className="hud-card">
      <div className="hud-title">
        <Sparkles size={16} /> Environmental & Load Manipulator
      </div>

      {/* Quick Weather Selectors */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, fontFamily: "var(--font-hud)", fontWeight: 700 }}>
          SELECT WEATHER ENVIRONMENT:
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "sunny", label: "☀️ Sunny", icon: Sun, color: "var(--neon-amber)" },
            { id: "cloudy", label: "☁️ Cloudy", icon: Cloud, color: "var(--text-dim)" },
            { id: "rainy", label: "🌧️ Rainy", icon: CloudRain, color: "#60a5fa" },
            { id: "heatwave", label: "🔥 Heatwave", icon: Thermometer, color: "var(--neon-red)" },
          ].map((w) => (
            <button
              key={w.id}
              className={`cyber-btn ${params.weather === w.id ? "cyber-btn-active" : ""}`}
              onClick={() => onWeatherPreset(w.id)}
              style={{ fontSize: 13, padding: "6px 12px" }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {/* Time of Day */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Clock size={14} style={{ inlineSize: "auto" }} /> Time of Day</span>
            <span className="slider-val">{String(params.hour).padStart(2, "0")}:00 HRS</span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            step="1"
            className="cyber-slider"
            value={params.hour}
            onChange={(e) => onChangeParam("hour", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Cloud Coverage */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Cloud size={14} /> Cloud Coverage</span>
            <span className="slider-val">{params.cloudCoverage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="cyber-slider"
            value={params.cloudCoverage}
            onChange={(e) => onChangeParam("cloudCoverage", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Temperature */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Thermometer size={14} /> Temperature</span>
            <span className="slider-val" style={{ color: params.temp > 35 ? "var(--neon-red)" : "var(--neon-cyan)" }}>
              {params.temp}°C
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            className="cyber-slider"
            value={params.temp}
            onChange={(e) => onChangeParam("temp", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Irradiance */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Sun size={14} /> Irradiance</span>
            <span className="slider-val">{currentIrradiance} W/m²</span>
          </div>
          <input
            type="range"
            min="0"
            max="1200"
            step="20"
            className="cyber-slider"
            value={currentIrradiance}
            onChange={(e) => onChangeParam("irradiance", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Shading */}
        <div className="slider-group">
          <div className="slider-label">
            <span>🌳 Shading Level</span>
            <span className="slider-val">{params.shading}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="cyber-slider"
            value={params.shading}
            onChange={(e) => onChangeParam("shading", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Panel Soiling */}
        <div className="slider-group">
          <div className="slider-label">
            <span>🧹 Panel Soiling (Dust)</span>
            <span className="slider-val">{params.soiling}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="cyber-slider"
            value={params.soiling}
            onChange={(e) => onChangeParam("soiling", parseInt(e.target.value, 10))}
          />
        </div>

        {/* Home Load */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Home size={14} /> Home Load</span>
            <span className="slider-val" style={{ color: "var(--neon-amber)" }}>{params.homeLoad.toFixed(1)} kW</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            className="cyber-slider"
            value={params.homeLoad}
            onChange={(e) => onChangeParam("homeLoad", parseFloat(e.target.value))}
          />
        </div>

        {/* Battery State */}
        <div className="slider-group">
          <div className="slider-label">
            <span><Battery size={14} /> Battery Charge</span>
            <span className="slider-val" style={{ color: "var(--neon-green)" }}>{params.batteryLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="cyber-slider"
            value={params.batteryLevel}
            onChange={(e) => onChangeParam("batteryLevel", parseInt(e.target.value, 10))}
          />
        </div>
      </div>
    </div>
  );
}
