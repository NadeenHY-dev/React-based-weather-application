import React from 'react';
import { Button, Card } from 'react-bootstrap';

function WeatherModal({ city, onClose }) {
  if (!city) return null;

  return (
    <div style={overlayStyle}>
      <Card style={cardStyle}>
        <Card.Body>
          <Button variant="danger" onClick={onClose} className="float-end">X</Button>
          <Card.Title className="mt-2">{city.name} ({city.country})</Card.Title>
          <Card.Text>
            <strong>Latitude:</strong> {city.latitude}°<br />
            <strong>Longitude:</strong> {city.longitude}°<br />
            <em>Weather details can be fetched from an API here.</em>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
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
  maxWidth: '400px'
};

export default WeatherModal;
