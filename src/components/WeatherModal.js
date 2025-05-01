import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

function WeatherModal({ city, onClose }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (!city) return null;

return (
  <div style={overlayStyle} onClick={onClose}>
    <div style={modalWrapperStyle} onClick={(e) => e.stopPropagation()}>
      <Card style={cardStyle}>
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
                <li key={index}>
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

function formatDate(dateNum) {
  const str = dateNum.toString();
  return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardStyle = {
  width: '95%',
  maxWidth: '600px',
  padding: '20px',
};

const modalWrapperStyle = {
  width: '100%',
  maxWidth: '600px',
  zIndex: 10000,
};

export default WeatherModal;
