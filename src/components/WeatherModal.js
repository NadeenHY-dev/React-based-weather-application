import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

/**
 * Displays a modal with a 7-day weather forecast for the given city.
 *
 * @component
 * @param {{ city: { name: string, country: string, latitude: number, longitude: number }, onClose: Function }} props
 * @returns {JSX.Element|null} The rendered weather modal or null if no city is selected.
 */
function WeatherModal({ city, onClose }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Fetch weather data from 7timer API when the city changes.
   */
  useEffect(() => {
    if (!city) return;

    const url = `https://www.7timer.info/bin/api.pl?lon=${city.longitude}&lat=${city.latitude}&product=civillight&output=json`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setForecast(data.dataseries || []);
        setLoading(false);
        setError(false);
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        setError(true);
        setLoading(false);
      });
  }, [city]);

  /**
   * Return an emoji icon based on the weather type.
   * @param {string} weather - The weather condition code from the API.
   * @returns {string} The emoji representing the weather.
   */
  function getWeatherIcon(weather) {
    switch (weather) {
      case 'clear': return '☀️';
      case 'pcloudy': return '🌤️';
      case 'mcloudy': return '⛅';
      case 'cloudy': return '☁️';
      case 'rain': return '🌧️';
      case 'lightrain': return '🌦️';
      case 'snow': return '❄️';
      case 'ts': return '⛈️';
      case 'tsrain': return '🌩️';
      default: return '❓';
    }
  }

  /**
   * Return a background color based on the weather condition.
   * @param {string} weather - The weather condition code.
   * @returns {string} A CSS-compatible color string.
   */
  function getColorByWeather(weather) {
    switch (weather) {
      case 'clear': return '#FFD700';      // Yellow
      case 'pcloudy': return '#FFA500';    // Orange
      case 'cloudy': return '#87CEEB';     // Light Blue
      case 'rain': return '#4682B4';       // Steel Blue
      case 'snow': return '#A9A9A9';       // Gray
      case 'ts': return '#8B0000';         // Dark Red
      case 'tsrain': return '#800080';     // Purple
      default: return '#ccc';              // Neutral fallback
    }
  }

  if (!city) return null;

  return (
    <div className="weather-modal-overlay" onClick={onClose}>
      <div className="weather-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <Card className="weather-modal-card">
          <Card.Body>
            <Button variant="danger" onClick={onClose} className="float-end">X</Button>
            <Card.Title>{city.name} ({city.country})</Card.Title>
            <Card.Text>
              Latitude: {city.latitude}°<br />
              Longitude: {city.longitude}°
            </Card.Text>

            {loading ? (
              <Spinner animation="border" />
            ) : forecast.length > 0 ? (
              <ul className="mt-3">
                {forecast.map((day, index) => (
                  <li
                    key={index}
                    className="weather-list-item"
                    style={{ backgroundColor: getColorByWeather(day.weather) }}
                  >
                    {formatDate(day.date)} – {getWeatherIcon(day.weather)} {day.weather}
                    <span className="text-muted ms-2">
                      (Min: {day.temp2m.min}°, Max: {day.temp2m.max}°, Wind: {day.wind10m_max})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-danger mt-3">Couldn’t fetch the forecast – maybe the wind blew the signal 🌬️📡</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

/**
 * Converts a numeric date (YYYYMMDD) into a human-readable format DD/MM/YYYY.
 *
 * @param {number} dateNum - Date as a number in YYYYMMDD format.
 * @returns {string} Formatted date string.
 */
function formatDate(dateNum) {
  const str = dateNum.toString();
  return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
}

export default WeatherModal;
