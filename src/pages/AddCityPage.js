import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AddCityPage() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.first.org/data/v1/countries')
      .then(res => res.json())
      .then(data => {
        const entries = Object.entries(data.data).map(([code, info]) => ({
          code,
          name: info.country,
        }));
        setCountries(entries);
      });
  }, []);

  const isValidName = (text) => /^[A-Za-z\s]+$/.test(text);
  const isValidLat = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLong = (long) => !isNaN(long) && long >= -180 && long <= 180;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCountry = country.trim();
    const lat = Number(latitude);
    const long = Number(longitude);

    // Check for empty fields first
    if (!trimmedName || !trimmedCountry || latitude === '' || longitude === '') {
      return setMessage('Please fill in all fields before submitting.');
    }

    // Validation
    if (!isValidName(trimmedName)) {
      return setMessage('City name must contain only English letters');
    }

    if (!isValidLat(lat)) {
      return setMessage('Latitude must be a number between -90 and 90');
    }

    if (!isValidLong(long)) {
      return setMessage('Longitude must be a number between -180 and 180');
    }

    // Check for duplicates
    const savedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    const duplicate = savedCities.some(
      (c) =>
        c.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        c.country.trim().toLowerCase() === trimmedCountry.toLowerCase()
    );
    if (duplicate) {
      return setMessage('This city is already saved.');
    }

    // Save
    const city = {
      name: trimmedName,
      country: trimmedCountry,
      latitude: lat,
      longitude: long,
    };

    savedCities.push(city);
    localStorage.setItem('cities', JSON.stringify(savedCities));
    navigate('/');
  };


  return (
    <div>
      <h2>Add a New City</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>City Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter city name"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Select Country</Form.Label>
          <Form.Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">-- Select Country --</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Latitude</Form.Label>
          <Form.Control
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Between -90 and 90"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Longitude</Form.Label>
          <Form.Control
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Between -180 and 180"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Add City
        </Button>
      </Form>

      {message && (
        <Alert
          variant={message.includes('success') ? 'success' : 'danger'}
          className="mt-3"
        >
          {message}
        </Alert>
      )}
    </div>
  );
}

export default AddCityPage;
