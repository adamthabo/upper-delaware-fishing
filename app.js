// USGS and Weather API endpoints
const usgsEndpoint = "https://waterservices.usgs.gov/nwis/iv/?sites=01427207&format=json&parameterCd=00060,00065,00010";
const weatherEndpoint = "https://api.weather.gov/gridpoints/BGM/71,61/forecast/hourly";

async function fetchRiverConditions() {
  const response = await fetch(usgsEndpoint);
  const data = await response.json();
  const readings = data.value.timeSeries;

  const flow = readings.find(series => series.variable.variableCode[0].value === "00060").values[0].value[0].value;
  const level = readings.find(series => series.variable.variableCode[0].value === "00065").values[0].value[0].value;
  const temp = readings.find(series => series.variable.variableCode[0].value === "00010").values[0].value[0].value;

  document.getElementById("flow").textContent = `Flow: ${flow} cfs`;
  document.getElementById("level").textContent = `Level: ${level} ft`;
  document.getElementById("temp").textContent = `Temperature: ${temp}°C`;

  checkFishingConditions(flow, temp);
}

async function fetchWeather() {
  const response = await fetch(weatherEndpoint);
  const data = await response.json();
  const forecast = data.properties.periods[0];

  document.getElementById("weather").textContent = `${forecast.shortForecast}, ${forecast.temperature}°${forecast.temperatureUnit}`;
}

function suggestFlyPatterns(temp) {
  const flies = [];

  if (temp <= 10) {
    flies.push("Blue Wing Olive #18-22", "Little Black Stonefly #16-18");
  } else if (temp > 10 && temp <= 16) {
    flies.push("Hendrickson #14-16", "Parachute Adams #14-16");
  } else {
    flies.push("Sulphur Dun #16-18", "Elk Hair Caddis #14-16");
  }

  const fliesList = document.getElementById("flies");
  fliesList.innerHTML = '';
  flies.forEach(fly => {
    const li = document.createElement("li");
    li.textContent = fly;
    fliesList.appendChild(li);
  });
}

function checkFishingConditions(flow, temp) {
  const alertsDiv = document.getElementById("alerts");
  if (flow >= 500 && flow <= 2000 && temp >= 8 && temp <= 18) {
    alertsDiv.textContent = "🔥 Conditions are PERFECT for fishing!";
  } else {
    alertsDiv.textContent = "⚠️ Conditions are suboptimal, fish carefully.";
  }

  suggestFlyPatterns(temp);
}

fetchRiverConditions();
fetchWeather();
setInterval(() => {
  fetchRiverConditions();
  fetchWeather();
}, 900000); // refresh every 15 mins
