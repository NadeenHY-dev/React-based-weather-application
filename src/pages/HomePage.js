import { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col, Spinner } from 'react-bootstrap';
import useCountries from '../hooks/useCountries';
import WeatherModal from '../components/WeatherModal';

function HomePage() {
  const [cities, setCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCountry, setFilteredCountry] = useState('');
  const [loading, setLoading] = useState(true);

  const countries = useCountries();

useEffect(() => {
  const savedCities = JSON.parse(localStorage.getItem('cities') || '[]');
  const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');

  const favCities = savedCities.filter(city =>
    savedFavorites[city.name + city.country]
  );

  favCities.sort((a, b) => a.name.localeCompare(b.name));
  setCities(favCities);
  setLoading(false);
}, []);


  const isValidName = (text) => /^[A-Za-z\s]+$/.test(text);
  const isValidLat = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLong = (long) => !isNaN(long) && long >= -180 && long <= 180;

  const handleDelete = (index) => {
    const updated = [...cities];
    updated.splice(index, 1);
    setCities(updated);
    localStorage.setItem('cities', JSON.stringify(updated));
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedCity({ ...cities[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleSave = () => {
    const trimmedName = editedCity.name.trim();
    const trimmedCountry = editedCity.country.trim();
    const lat = editedCity.latitude;
    const long = editedCity.longitude;

    if (!isValidName(trimmedName)) return alert('City name must contain only English letters');
    if (lat === '' || !isValidLat(Number(lat))) return alert('Latitude must be between -90 and 90');
    if (long === '' || !isValidLong(Number(long))) return alert('Longitude must be between -180 and 180');
    if (!trimmedCountry) return alert('Please select a country');

    const duplicate = cities.some((c, i) => {
      const existingName = c.name.trim().toLowerCase();
      const existingCountry = c.country.trim().toLowerCase();
      return i !== editingIndex && existingName === trimmedName.toLowerCase() && existingCountry === trimmedCountry.toLowerCase();
    });
    if (duplicate) return alert('This city is already saved.');

    const updated = [...cities];
    updated[editingIndex] = { ...editedCity, name: trimmedName, country: trimmedCountry };
    updated.sort((a, b) => a.name.localeCompare(b.name));
    setCities(updated);
    localStorage.setItem('cities', JSON.stringify(updated));
    setEditingIndex(null);
  };

  const filteredCities = filteredCountry
    ? cities.filter((c) => c.country === filteredCountry)
    : cities;

  return (
    <div>
      <h2 className="text-center mb-4">Saved Cities</h2>
      <Form.Select
        className="mb-3"
        value={filteredCountry}
        onChange={(e) => setFilteredCountry(e.target.value)}
      >
        <option value="">-- Filter by Country --</option>
        {countries.map((c) => (
        <option key={c.code} value={c.name}>
          {c.name}
        </option>
        ))}
      </Form.Select>
      {filteredCountry && (
        <Button variant="secondary" className="mb-3" onClick={() => setFilteredCountry('')}>
          Reset Filter
        </Button>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : filteredCities.length === 0 ? (
        <p>No cities added yet.</p>
      ) : (
        <Row>
          {filteredCities.map((city, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
            <Card
              onClick={() => {
                if (editingIndex === null) {
                  setSelectedCity(city);
                }
              }}
              style={{ cursor: editingIndex === null ? 'pointer' : 'default' }}
            >
                <Card.Body>
                  {editingIndex === index ? (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          value={editedCity.name}
                          onChange={(e) => setEditedCity({ ...editedCity, name: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          value={editedCity.country}
                          onChange={(e) => setEditedCity({ ...editedCity, country: e.target.value })}
                        >
                          <option value="">-- Select Country --</option>
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control
                          type="number"
                          value={editedCity.latitude}
                          onChange={(e) => setEditedCity({ ...editedCity, latitude: e.target.value })}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control
                          type="number"
                          value={editedCity.longitude}
                          onChange={(e) => setEditedCity({ ...editedCity, longitude: e.target.value })}
                        />
                      </Form.Group>

                      <Button variant="success" onClick={handleSave} className="me-2">
                        Save
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Card.Title className="text-primary fw-bold">
                        {city.name} ({city.country})
                      </Card.Title>
                      <Card.Text>
                        <strong>Latitude:</strong> {city.latitude}
                        <br />
                        <strong>Longitude:</strong> {city.longitude}
                      </Card.Text>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(index);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(index);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedCity && (
        <WeatherModal city={selectedCity} onClose={() => setSelectedCity(null)} />
      )}
    </div>
  );
}

export default HomePage;
