function getConditionText(code) {
  if (code >= 0 && code <= 1) return "Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snowfall";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95].includes(code)) return "Thunderstorm";
  return "Unknown";
}

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultBox = document.getElementById("weatherResult");

  resultBox.innerHTML = "Loading...";

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const weather = weatherData.current_weather;

    const conditionText = getConditionText(weather.weathercode);

    const result = `
      <p><strong>${name}</strong>, ${country}</p>
      <p>🌡️ Temperature: ${weather.temperature} °C</p>
      <p>🌥️ Condition: ${conditionText}</p>
      <p>💨 Wind: ${weather.windspeed} km/h</p>
      <p>🕒 Time: ${weather.time}</p>
    `;
    resultBox.innerHTML = result;
  } catch (error) {
    resultBox.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
