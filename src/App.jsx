import React, { useState, useEffect } from "react";
import "./App.css";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("bangalore");

  const apiKey = "0e19f34dfa7139365b25db337dd330a6";

  const getDailyForecast = (list) => {
    const daily = [];
    const usedDates = new Set();

    for (const item of list) {
      const date = item.dt_txt.split(" ")[0];
      if (!usedDates.has(date)) {
        usedDates.add(date);
        daily.push({
          date,
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        });
      }
      if (daily.length === 7) break;
    }

    return daily;
  };

  const fetchWeather = () => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(([weatherData, forecastData]) => {
        if (weatherData.cod !== 200) {
          alert(weatherData.message);
          setWeather(null);
          setForecast([]);
          return;
        }

        setWeather(weatherData);

        if (forecastData.cod === "200" && forecastData.list) {
          setForecast(getDailyForecast(forecastData.list));
        } else {
          setForecast([]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const weekday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="app-shell">
      <div className="weather-app">
        <header className="app-header">
          <div>
            <p className="section-label">Weather Dashboard</p>
            <h1>Weather App</h1>
          </div>
          <div className="search-row">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
            />
            <button onClick={fetchWeather}>Search</button>
          </div>
        </header>

        <div className="weather-card">
          {weather && weather.weather && weather.main ? (
            <>
              <div className="weather-card__hero">
                <div>
                  <p className="weather-day">{weekday}</p>
                  <h2 className="weather-city">{weather.name}</h2>
                  <p className="weather-desc">
                    {weather.weather[0].description}
                  </p>
                </div>
                <div className="temperature-block">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="weather-icon"
                  />
                  <span className="temperature-value">
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span>Humidity</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>
                <div className="detail-item">
                  <span>Wind</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
                <div className="detail-item">
                  <span>Pressure</span>
                  <strong>{weather.main.pressure} hPa</strong>
                </div>
              </div>

              {forecast.length > 0 && (
                <div className="forecast-section">
                  <p className="forecast-title">7-day forecast</p>
                  <div className="forecast-row">
                    {forecast.map((day) => {
                      const weekdayShort = new Date(
                        day.date,
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                      });
                      return (
                        <div className="forecast-card" key={day.date}>
                          <p>{weekdayShort}</p>
                          <img
                            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                            alt={day.description}
                          />
                          <span>{day.temp}°</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Enter a city and press Search to view the weather.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
