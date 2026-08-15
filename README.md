# 🎮 SolarSense Simulator — Digital Twin Control Room Game UI

> **SolarSense Simulator UI** is a standalone, cyberpunk-themed **Solar Twin Control Room & Digital Twin Game Interface**. It empowers operators and developers to manipulate weather physics, environmental variables, and solar array parameters in real-time.

### 🌐 Live Demo: [https://server-sense-simulator.vercel.app](https://server-sense-simulator.vercel.app)

---

## ✨ Features & Visual Stage

### ☀️ 1. Animated Physics Canvas (`WeatherVisualCanvas.jsx`)
- **☀️ Sunny Day**: Pulsating sun disk with rotating ray beams (`@keyframes rotateRays`) and golden panel flare reflections.
- **🌧️ Heavy Rain**: Stormy sky gradient with smooth CSS falling raindrops (`@keyframes rainFall`).
- **☁️ Cloud Coverage**: Layered drifting cloud particles scaling dynamically from 0% to 100% obscurity.
- **🔥 Heat Wave**: Thermal shimmer distortion overlay (`@keyframes heatShimmer`) over a fiery red/amber backdrop.
- **🌳 Tree Shading**: Dynamic afternoon tree shadow overlay casting across solar panels when shading > 0%.
- **🧹 Panel Dust / Soiling**: Dirt and dust accumulation layer on panel glass proportional to soiling %.
- **⚠️ Inverter Spark**: Electrical fault spark particle overlay during hardware failures.

### 🎛️ 2. Tactile Environmental & Load Manipulator
- **Enlarged Touch Sliders**: 26px glowing cyan thumb handles with active expansion for ultra-smooth mouse and touch dragging.
- **Precision Parameters**:
  - 🕐 **Time of Day** (00:00 – 23:00 HRS)
  - ☁️ **Cloud Coverage** (0% – 100%)
  - 🌡️ **Ambient Temperature** (0°C – 50°C)
  - ☀️ **Irradiance** (0 – 1200 W/m²)
  - 🌳 **Shading Level** (0% – 100%)
  - 🧹 **Panel Soiling / Dust** (0% – 100%)
  - 🏠 **Home Load** (0.5 – 10.0 kW)
  - 🔋 **Battery Charge** (0% – 100%)

### 🎮 3. One-Click Scenario Event Triggers
- **Sunny Day**: Clear sky peak generation.
- **Cloud Attack!**: Sudden 85% cloud obscurity dip.
- **Shading Event**: Time-locked afternoon tree shadow (14:00–17:00).
- **Dirty Panels**: Dust accumulation efficiency degradation.
- **Heat Wave**: Extreme 45°C thermal efficiency loss.
- **Heavy Rain**: 90% sky obscurity + panel wash.
- **Inverter Failure**: Immediate hardware cliff drop.
- **Random Event**: Procedural chaos generator.

### ⚡ 4. Real-Time Telemetry & Charts
- **Live Energy Flow**: Visual current tracking power flow between Sun, Panel, Inverter, Home, Battery, and Grid.
- **12-Field Telemetry Grid**: Flashing value tiles for AC/DC Voltages, Frequencies, Currents, Irradiance, Temperatures, Power Factor, and Efficiency.
- **Expected vs Actual Chart**: Interactive Recharts curve overlaying clear-sky expectations against real-time generated power.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Cyberpunk Dark CSS (Orbitron, Rajdhani, JetBrains Mono typography, custom dark scrollbars)
- **Animation**: HTML5 Canvas + CSS Keyframe Animations
- **Charts**: Recharts (`ResponsiveContainer`, `AreaChart`, `LineChart`)
- **Icons**: Lucide React
- **Networking**: Axios + Socket.IO Client

---

## 📁 Directory Structure

```text
simulator-ui/
├── src/
│   ├── components/
│   │   ├── WeatherVisualCanvas.jsx   # Animated weather & panel stage
│   │   ├── EnvironmentSliders.jsx    # Tactile slider manipulator
│   │   ├── EventTriggerPanel.jsx     # Scenario event trigger buttons
│   │   ├── LiveFlowDiagram.jsx       # Energy flow SVG diagram
│   │   ├── LiveTelemetryGrid.jsx     # 12-field telemetry grid
│   │   ├── ExpectedVsActualChart.jsx # Recharts generation comparison
│   │   ├── ControlRoomHeader.jsx     # Header status & navigation
│   │   └── AIDetectiveAlert.jsx      # AI anomaly banner
│   ├── services/
│   │   ├── math.js                   # Local solar physics & thermal math
│   │   └── scenarios.js              # Scenario definitions
│   ├── App.jsx                       # Main Control Room dashboard
│   ├── main.jsx                      # React DOM entry point
│   └── index.css                     # Cyberpunk dark theme & custom scrollbars
├── vite.config.js                    # Port 5174 dev server configuration
└── package.json
```

---

## 🔄 Real-Time Backend Synchronization Workflow

```text
  Simulator Control Room (5174)
             │
             │ HTTP POST /api/simulator/scenario { overrides }
             ▼
  Express Server Twin (Port 4000)
             │
             │ Recalculates Physics & Emits Socket Event 'solar:status'
             ├──────────────────────────┐
             ▼                          ▼
  Main Website (5173)         Simulator UI (5174)
  Updates in Real-Time        Updates in Real-Time
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The simulator game UI will open at **`http://localhost:5174`** (or `http://localhost:5175`).

---

## 📜 License

MIT License — Free for open-source & educational use.