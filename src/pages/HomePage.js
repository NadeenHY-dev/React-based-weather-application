import { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import useCountries from '../hooks/useCountries';

function HomePage() {
  const [cities, setCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const countries = useCountries();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cities') || '[]');
    setCities(saved);
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

    if (!isValidName(trimmedName)) {
      return alert('City name must contain only English letters');
    }
    if (lat === '' || !isValidLat(Number(lat))) {
      return alert('Latitude is required and must be a number between -90 and 90');
    }
    if (long === '' || !isValidLong(Number(long))) {
      return alert('Longitude is required and must be a number between -180 and 180');
    }
    if (!trimmedCountry) {
      return alert('Please select a country');
    }

    const duplicate = cities.some((c, i) => {
      const existingName = c.name.trim().toLowerCase();
      const existingCountry = c.country.trim().toLowerCase();
      return (
        i !== editingIndex &&
        existingName === trimmedName.toLowerCase() &&
        existingCountry === trimmedCountry.toLowerCase()
      );
    });

    if (duplicate) {
      return alert('This city is already saved.');
    }

    const updated = [...cities];
    updated[editingIndex] = {
      ...editedCity,
      name: trimmedName,
      country: trimmedCountry,
    };

    setCities(updated);
    localStorage.setItem('cities', JSON.stringify(updated));
    setEditingIndex(null);
  };

  return (
    <div>
      <h2 className="text-center mb-4">Saved Cities</h2>
      {cities.length === 0 && <p>No cities added yet.</p>}
      <Row>
        {cities.map((city, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                {editingIndex === index ? (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        value={editedCity.name}
                        onChange={(e) =>
                          setEditedCity({ ...editedCity, name: e.target.value })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        value={editedCity.country}
                        onChange={(e) =>
                          setEditedCity({
                            ...editedCity,
                            country: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setEditedCity({
                            ...editedCity,
                            latitude: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="number"
                        value={editedCity.longitude}
                        onChange={(e) =>
                          setEditedCity({
                            ...editedCity,
                            longitude: e.target.value,
                          })
                        }
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
                      onClick={() => handleEditClick(index)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(index)}>
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default HomePage;
