import { getScenario } from "./scenarios.js";

function seeded(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function clearSkyValue(h) {
  const peak = 12.5;
  const spread = 3.4;
  const base = 5.1 * Math.exp(-Math.pow(h - peak, 2) / (2 * spread * spread));
  const noise = Math.sin(h * 3.1) * 0.15;
  return Math.max(0, base + noise);
}

function scenarioMultiplierAt(h, scenario) {
  if (!scenario.affectedHours && !scenario.gradual) {
    return 1 - seeded(h) * 0.04;
  }
  if (scenario.gradual) {
    const [minDrop, maxDrop] = scenario.dropRange;
    const progress = Math.min(1, Math.max(0, (h - 6) / 13));
    const drop = minDrop + (maxDrop - minDrop) * progress;
    return 1 - drop;
  }
  const [start, end] = scenario.affectedHours;
  if (h < start || h > end) return 1 - seeded(h) * 0.04;
  const [minDrop, maxDrop] = scenario.dropRange;
  if (scenario.cliff) {
    return h === start ? 1 - minDrop * 0.4 : 1 - maxDrop;
  }
  const wobble = seeded(h * 7.7);
  return 1 - (minDrop + (maxDrop - minDrop) * wobble);
}

export function buildTodayCurve(scenarioId = "normal", overrides = {}) {
  const scenario = getScenario(scenarioId);
  const points = [];

  let weatherMult = 1.0;
  if (overrides.weather === "cloudy") weatherMult = 0.40;
  if (overrides.weather === "rainy") weatherMult = 0.15;
  if (overrides.weather === "heatwave") weatherMult = 0.70;
  if (overrides.weather === "sunny") weatherMult = 1.0;

  const cloudMult = overrides.cloudCoverage !== undefined ? Math.max(0.05, 1 - (overrides.cloudCoverage / 100) * 0.90) : 1;
  const shadingMult = overrides.shading !== undefined ? Math.max(0.1, 1 - (overrides.shading / 100) * 0.85) : 1;
  const soilingMult = overrides.soiling !== undefined ? Math.max(0.3, 1 - (overrides.soiling / 100) * 0.65) : 1;
  const tempMult = overrides.temp !== undefined ? Math.max(0.35, 1 - Math.max(0, overrides.temp - 25) * 0.015) : 1;

  for (let h = 6; h <= 19; h++) {
    const expected = +clearSkyValue(h).toFixed(2);
    let multiplier = scenarioMultiplierAt(h, scenario);

    multiplier *= weatherMult * cloudMult * shadingMult * soilingMult * tempMult;

    if (overrides.irradiance !== undefined) {
      multiplier *= (overrides.irradiance / 1000);
    }

    const generation = +Math.max(0, expected * multiplier).toFixed(2);
    const consumption = overrides.homeLoad !== undefined 
      ? overrides.homeLoad 
      : +(1.6 + Math.sin((h - 6) / 2) * 0.5 + 0.4).toFixed(2);
    points.push({ hour: `${h}:00`, expected, generation, consumption });
  }
  return points;
}

export function nextLiveReading(prev, scenarioId = "normal", overrides = {}) {
  const now = new Date();
  const currentH = overrides.hour !== undefined ? overrides.hour : now.getHours();
  const currentM = overrides.hour !== undefined ? 0 : now.getMinutes();
  const currentS = overrides.hour !== undefined ? 0 : now.getSeconds();
  const hourFrac = currentH + currentM / 60 + currentS / 3600;

  const clearSkyNow = Math.max(0, clearSkyValue(hourFrac));

  let targetMult = 1.0;
  const h = Math.floor(hourFrac);

  switch (scenarioId) {
    case "cloudy":
      targetMult = 0.38;
      break;
    case "shading":
      targetMult = h >= 14 && h <= 17 ? 0.30 : 0.95;
      break;
    case "soiling": {
      const progress = Math.min(1, Math.max(0, (hourFrac - 6) / 13));
      targetMult = 1 - (0.12 + 0.28 * progress);
      break;
    }
    case "inverter":
      targetMult = h >= 12 ? 0.10 : 0.85;
      break;
    default:
      targetMult = 0.98;
  }

  let weatherFactor = 1.0;
  if (overrides.weather === "cloudy") weatherFactor = 0.40;
  if (overrides.weather === "rainy") weatherFactor = 0.15;
  if (overrides.weather === "heatwave") weatherFactor = 0.70;
  if (overrides.weather === "sunny") weatherFactor = 1.0;

  const cloudFactor = overrides.cloudCoverage !== undefined ? Math.max(0.05, 1 - (overrides.cloudCoverage / 100) * 0.90) : 1;
  const shadingFactor = overrides.shading !== undefined ? Math.max(0.1, 1 - (overrides.shading / 100) * 0.85) : 1;
  const soilingFactor = overrides.soiling !== undefined ? Math.max(0.3, 1 - (overrides.soiling / 100) * 0.65) : 1;
  const tempFactor = overrides.temp !== undefined ? Math.max(0.35, 1 - Math.max(0, overrides.temp - 25) * 0.015) : 1;

  const baseIrradiance = Math.max(0, Math.round((clearSkyNow / 5.1) * 1000 * cloudFactor * weatherFactor * shadingFactor));
  const irradiance = overrides.irradiance !== undefined ? overrides.irradiance : baseIrradiance;
  const irrFactor = irradiance / 1000;

  const target = clearSkyNow * targetMult * weatherFactor * cloudFactor * shadingFactor * soilingFactor * tempFactor * irrFactor;
  const solar = Math.max(0, +(target + (Math.random() - 0.5) * 0.05).toFixed(2));

  const home = overrides.homeLoad !== undefined ? overrides.homeLoad : 2.1;

  const surplus = solar - home;
  const battPower = +(Math.sign(surplus) * Math.min(2.5, Math.abs(surplus) * 0.75)).toFixed(2);
  const battery = overrides.batteryLevel !== undefined
    ? overrides.batteryLevel
    : +Math.min(100, Math.max(5, prev.battery + battPower * 0.15)).toFixed(0);

  const gridNet = +(surplus - battPower).toFixed(2);
  const grid = Math.max(0, +gridNet.toFixed(2));

  const ambientTemp = overrides.temp !== undefined ? overrides.temp : 30;
  const panelTemp = +(ambientTemp + (irradiance / 1000) * 25 + (Math.random() - 0.5) * 1.0).toFixed(1);
  const acVoltage = +(230 + (solar > 0 ? solar * 1.2 : -2.0) + (Math.random() - 0.5) * 2.0).toFixed(1);
  const acFrequency = +(50.0 + (Math.random() - 0.5) * 0.04).toFixed(2);
  const dcVoltage = solar > 0.05 ? +(310 + solar * 12).toFixed(1) : 0;
  const dcCurrent = solar > 0.05 && dcVoltage > 0 ? +(solar * 1000 / dcVoltage).toFixed(2) : 0;
  const powerFactor = +(0.985 + (Math.random() - 0.5) * 0.008).toFixed(3);
  const efficiency = +(98.0 * tempFactor * soilingFactor).toFixed(1);

  return {
    solar, home, grid, gridNet,
    battery, battPower,
    irradiance, panelTemp, ambientTemp,
    acVoltage, acFrequency, dcVoltage, dcCurrent,
    powerFactor, efficiency,
  };
}
