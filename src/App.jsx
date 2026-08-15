import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import ControlRoomHeader from "./components/ControlRoomHeader.jsx";
import WeatherVisualCanvas from "./components/WeatherVisualCanvas.jsx";
import EnvironmentSliders from "./components/EnvironmentSliders.jsx";
import EventTriggerPanel from "./components/EventTriggerPanel.jsx";
import LiveFlowDiagram from "./components/LiveFlowDiagram.jsx";
import LiveTelemetryGrid from "./components/LiveTelemetryGrid.jsx";
import ExpectedVsActualChart from "./components/ExpectedVsActualChart.jsx";
import AIDetectiveAlert from "./components/AIDetectiveAlert.jsx";

const BACKEND_URL = "http://localhost:4000";

export default function App() {
  // Simulator State from Backend
  const [status, setStatus] = useState(null);
  const [connection, setConnection] = useState("connecting");
  const [activeMode, setActiveMode] = useState("control"); // "control" | "challenge"
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeEvent, setActiveEvent] = useState(null);

  // Manipulatable Parameters
  const [params, setParams] = useState({
    weather: "sunny",
    hour: new Date().getHours(),
    cloudCoverage: 10,
    temp: 28,
    shading: 0,
    soiling: 0,
    homeLoad: 2.1,
    batteryLevel: 76,
  });

  // Audio SFX Generator via Web Audio API (Futuristic Game Sound)
  const audioCtxRef = useRef(null);
  const playSFX = useCallback((type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "win") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio autoplay restriction fallback
    }
  }, [soundEnabled]);

  // Push Parameter Changes to Server Digital Twin Engine
  const pushParamsToServer = useCallback(async (newParams, scenarioId = null) => {
    try {
      const payload = { overrides: newParams };
      if (scenarioId) payload.scenarioId = scenarioId;

      const res = await axios.post(`${BACKEND_URL}/api/simulator/scenario`, payload);
      if (res.data) setStatus(res.data);
    } catch (err) {
      console.warn("[Simulator UI] Failed to push params to backend:", err.message);
    }
  }, []);

  // Update a single parameter slider/control
  const handleParamChange = (key, val) => {
    playSFX("click");
    setParams((prev) => {
      const updated = { ...prev, [key]: val };
      pushParamsToServer(updated);
      return updated;
    });
  };

  // Weather Preset Handler
  const handleWeatherPreset = (weatherId) => {
    playSFX("click");
    let presetOverrides = { weather: weatherId };
    let scenarioId = "normal";

    if (weatherId === "sunny") {
      presetOverrides = { ...presetOverrides, cloudCoverage: 0, irradiance: 950, temp: 28, shading: 0, soiling: 0 };
    } else if (weatherId === "cloudy") {
      presetOverrides = { ...presetOverrides, cloudCoverage: 75, irradiance: 350, temp: 24 };
      scenarioId = "cloudy";
    } else if (weatherId === "rainy") {
      presetOverrides = { ...presetOverrides, cloudCoverage: 90, irradiance: 150, temp: 20 };
      scenarioId = "cloudy";
    } else if (weatherId === "heatwave") {
      presetOverrides = { ...presetOverrides, cloudCoverage: 5, irradiance: 1100, temp: 45 };
    }

    setParams((prev) => {
      const updated = { ...prev, ...presetOverrides };
      pushParamsToServer(updated, scenarioId);
      return updated;
    });
  };

  // Game Event Trigger Handler
  const handleTriggerEvent = (eventId) => {
    playSFX(eventId.includes("attack") || eventId.includes("failure") ? "alert" : "click");
    setActiveEvent(eventId);

    let eventParams = {};
    let scenarioId = "normal";

    switch (eventId) {
      case "sunny":
        eventParams = { weather: "sunny", cloudCoverage: 0, irradiance: 1000, shading: 0, soiling: 0 };
        scenarioId = "normal";
        break;
      case "cloud_attack":
        eventParams = { weather: "cloudy", cloudCoverage: 85, irradiance: 240 };
        scenarioId = "cloudy";
        break;
      case "shading_event":
        eventParams = { shading: 55 };
        scenarioId = "shading";
        break;
      case "dirty_panels":
        eventParams = { soiling: 45 };
        scenarioId = "soiling";
        break;
      case "heat_wave":
        eventParams = { weather: "heatwave", temp: 45, cloudCoverage: 10, irradiance: 1050 };
        scenarioId = "normal";
        break;
      case "rain":
        eventParams = { weather: "rainy", cloudCoverage: 90, irradiance: 150, temp: 20 };
        scenarioId = "cloudy";
        break;
      case "inverter_failure":
        scenarioId = "inverter";
        break;
      case "random":
        eventParams = {
          cloudCoverage: Math.floor(Math.random() * 90),
          temp: Math.floor(20 + Math.random() * 25),
          irradiance: Math.floor(200 + Math.random() * 900),
          shading: Math.random() > 0.5 ? 40 : 0,
          soiling: Math.floor(Math.random() * 30),
          homeLoad: parseFloat((0.8 + Math.random() * 5).toFixed(1)),
        };
        break;
      default:
        break;
    }

    setParams((prev) => {
      const updated = { ...prev, ...eventParams };
      pushParamsToServer(updated, scenarioId);
      return updated;
    });
  };

  // Reset Everything to Defaults
  const handleReset = async () => {
    playSFX("click");
    setActiveEvent(null);
    const defaults = {
      weather: "sunny",
      hour: new Date().getHours(),
      cloudCoverage: 10,
      temp: 28,
      shading: 0,
      soiling: 0,
      homeLoad: 2.1,
      batteryLevel: 76,
    };
    setParams(defaults);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/simulator/scenario`, {
        scenarioId: "normal",
        resetOverrides: true,
      });
      if (res.data) setStatus(res.data);
    } catch (err) {
      console.warn("[Simulator UI] Reset failed:", err.message);
    }
  };

  // Connect to Backend Socket & REST Poll
  useEffect(() => {
    const socket = io(BACKEND_URL, { reconnection: true, timeout: 5000 });

    socket.on("connect", () => setConnection("live"));
    socket.on("disconnect", () => setConnection("connecting"));

    socket.on("solar:status", (data) => {
      setStatus(data);
      setConnection("live");
    });

    socket.on("solar:live", (liveSnap) => {
      setStatus((prev) => (prev ? { ...prev, live: liveSnap } : prev));
    });

    // Initial HTTP fetch
    axios.get(`${BACKEND_URL}/api/simulator/status`)
      .then((res) => {
        setStatus(res.data);
        setConnection("live");
      })
      .catch((err) => console.warn("[Simulator UI] Backend REST poll failed:", err.message));

    return () => socket.disconnect();
  }, []);

  const live = status?.live;
  const curve = status?.curve || [];
  const healthScore = status?.healthScore ?? 100;
  const scenario = status?.scenario;
  const anomalyActive = status?.anomalyActive ?? false;

  return (
    <div style={{ padding: "24px 20px 48px", maxWidth: 1280, margin: "0 auto" }}>
      {/* HUD Header */}
      <ControlRoomHeader
        connection={connection}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeEventName={activeEvent ? activeEvent.toUpperCase().replace("_", " ") : null}
      />

      {/* ☀️ 🌧️ Weather Visual Stage & Animated Solar Panels */}
      <WeatherVisualCanvas
        weather={params.weather}
        cloudCoverage={params.cloudCoverage}
        temp={params.temp}
        shading={params.shading}
        soiling={params.soiling}
        scenarioId={status?.scenarioId}
      />

      {/* Main Control Dashboard Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Left Column: Sliders & Triggers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <EnvironmentSliders
            params={params}
            onChangeParam={handleParamChange}
            onWeatherPreset={handleWeatherPreset}
            live={live}
          />

          <EventTriggerPanel
            onTriggerEvent={handleTriggerEvent}
            onReset={handleReset}
            activeEvent={activeEvent}
          />
        </div>

        {/* Right Column: Live Flow & AI Detective */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <LiveFlowDiagram
            solar={live?.solar ?? 0}
            home={live?.home ?? 0}
            battery={live?.battery ?? 50}
            grid={live?.grid ?? 0}
            battPower={live?.battPower ?? 0}
            gridNet={live?.gridNet ?? 0}
          />

          <AIDetectiveAlert
            anomalyActive={anomalyActive}
            scenario={scenario}
            healthScore={healthScore}
            curve={curve}
          />
        </div>
      </div>

      {/* Telemetry Meter Cards */}
      <LiveTelemetryGrid live={live} healthScore={healthScore} />

      {/* Expected vs Actual Curve Chart */}
      <ExpectedVsActualChart curve={curve} />
    </div>
  );
}
