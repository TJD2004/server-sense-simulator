export const SCENARIOS = {
  normal: {
    id: "normal",
    label: "Normal Day",
    emoji: "☀️",
    description: "Ideal solar generation profile with clear sky conditions.",
    affectedHours: null,
    gradual: false,
    insight: {
      title: "AI Performance Detective",
      body: "Generation profile matches clear-sky expectation closely across all daylight hours. No anomalous drops or efficiency degradation detected.",
      tags: ["✅ Baseline performance", "☀️ Clear sky tracking", "⚡ 100% System Health"],
      severity: "ok",
    },
  },
  cloudy: {
    id: "cloudy",
    label: "Passing Clouds",
    emoji: "☁️",
    description: "Random generation dips caused by cloud cover passing over the solar array.",
    affectedHours: [10, 15],
    gradual: false,
    dropRange: [0.35, 0.65],
    insight: {
      title: "AI Performance Detective",
      body: "Output shows multiple sharp, transient dips between 10:00 and 15:00. This fluctuating pattern aligns with passing cloud cover rather than hardware degradation.",
      tags: ["☁️ Cloud cover - high probability", "🌡️ Panel soiling - unlikely", "⚠️ Inverter fault - unlikely"],
      severity: "info",
    },
  },
  shading: {
    id: "shading",
    label: "Afternoon Shading",
    emoji: "🌳",
    description: "A tree or structure shades part of the array in the afternoon.",
    affectedHours: [14, 17],
    dailyMultiplier: 0.85,
    dropRange: [0.35, 0.5],
    insight: {
      title: "AI Performance Detective",
      body: "Output drops sharply every afternoon in the same 14:00–17:00 window while morning curve stays normal. This time-locked pattern points to fixed shading.",
      tags: ["🌳 Afternoon shading - likely contributor", "☁️ Cloud cover - unlikely", "🧹 Panel soiling - unlikely"],
      severity: "warn",
    },
  },
  soiling: {
    id: "soiling",
    label: "Panel Soiling",
    emoji: "🧹",
    description: "Dust/debris build-up gradually reduces panel efficiency.",
    affectedHours: null,
    gradual: true,
    dailyMultiplier: 0.85,
    dropRange: [0.08, 0.22],
    insight: {
      title: "AI Performance Detective",
      body: "Output is slightly below expected across the entire day with no sudden cliffs. A slow, uniform decline like this is consistent with dust build-up — panel clean recommended.",
      tags: ["🧹 Panel soiling - possible contributor", "☁️ Cloud cover - unlikely", "🌳 Shading - unlikely"],
      severity: "info",
    },
  },
  inverter: {
    id: "inverter",
    label: "Inverter Issue",
    emoji: "⚠️",
    description: "A sudden, sustained cliff-drop in output - hardware anomaly.",
    affectedHours: [12, 19],
    dailyMultiplier: 0.55,
    dropRange: [0.55, 0.75],
    cliff: true,
    insight: {
      title: "AI Performance Detective",
      body: "Output fell sharply within a single interval after 12:00 and hasn't recovered. This sudden, sustained cliff is consistent with an inverter or connection fault.",
      tags: ["⚠️ Inverter fault - possible, check hardware", "☁️ Cloud cover - unlikely", "🧹 Soiling - unlikely"],
      severity: "alert",
    },
  },
};

export const SCENARIO_LIST = Object.values(SCENARIOS);
export function getScenario(id) {
  return SCENARIOS[id] || SCENARIOS.normal;
}
