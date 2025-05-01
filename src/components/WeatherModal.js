import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

function WeatherModal({ city, onClose }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    const url = `https://www.7timer.info/bin/api.pl?lon=${city.longitude}&lat=${city.latitude}&product=civillight&output=json`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setForecast(data.dataseries || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        setLoading(false);
      });
  }, [city]);

const getWeatherIcon = (weather) => {
  switch (weather) {
    case 'clear': return '☀️';
    case 'pcloudy': return '🌤️';
    case 'mcloudy': return '⛅';
    case 'cloudy': return '☁️';
    case 'rain': return '🌧️';
    case 'lightrain': return '🌦️'; // ⬅️ هذا السطر الجديد
    case 'snow': return '❄️';
    case 'ts': return '⛈️';
    case 'tsrain': return '🌩️';
    default: return '❓';
  }
};


  if (!city) return null;

  return (
    <div style={overlayStyle}>
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
          ) : (
            <ul>
              {forecast.slice(0, 5).map((day, index) => (
                <li key={index}>
                  {formatDate(day.date)} – {getWeatherIcon(day.weather)} {day.weather}
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

function formatDate(date) {
  const str = date.toString();
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
  width: '90%',
  maxWidth: '400px',
};

export default WeatherModal;
