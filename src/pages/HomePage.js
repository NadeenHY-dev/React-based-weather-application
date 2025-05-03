import { useEffect, useState } from 'react';
import { Button, Form, Card, Row, Col, Spinner } from 'react-bootstrap';
import useCountries from '../hooks/useCountries';
import WeatherModal from '../components/WeatherModal';

function HomePage() {
  const [cities, setCities] = useState([]);
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
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => setFilteredCountry('')}
        >
          Reset Filter
        </Button>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : filteredCities.length === 0 ? (
        <p>No favorite cities added yet.</p>
      ) : (
        <Row>
          {filteredCities.map((city, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
            <Card className="weather-card">
                <Card.Body>
                  <Card.Title className="text-primary fw-bold">
                    {city.name} ({city.country})
                  </Card.Title>
                  <Card.Text>
                    <strong>Latitude:</strong> {city.latitude}
                    <br />
                    <strong>Longitude:</strong> {city.longitude}
                  </Card.Text>

                  <Button
                    variant="info"
                    onClick={() => setSelectedCity(city)}
                  >
                    Show 7-Day Weather
                  </Button>
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
