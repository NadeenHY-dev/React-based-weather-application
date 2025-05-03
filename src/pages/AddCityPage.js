import { useEffect, useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';

function AddCityPage() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState({ name: '', country: '', latitude: '', longitude: '' });
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // Load countries from API
    fetch('https://api.first.org/data/v1/countries')
      .then(res => res.json())
      .then(data => {
        const countryArray = Object.entries(data.data).map(([code, info]) => ({
          name: info.country,
          code
        }));
        setCountries(countryArray);
      });

    // Default cities if none saved
    let savedCities = JSON.parse(localStorage.getItem('cities') || '[]');
    if (savedCities.length === 0) {
      savedCities = [
        { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
        { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
        { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
        { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 }
      ];
      localStorage.setItem('cities', JSON.stringify(savedCities));
    }
    setCities(savedCities);

    // Load favorites
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites(savedFavorites);
  }, []);

  const isValidName = (text) => /^[A-Za-z\s]+$/.test(text);
  const isValidLat = (lat) => !isNaN(lat) && lat >= -90 && lat <= 90;
  const isValidLong = (long) => !isNaN(long) && long >= -180 && long <= 180;

  const validate = (city, isNew = true) => {
    const errs = {};
    if (!city.name.trim()) {
      errs.name = 'City name is required';
    } else if (!isValidName(city.name.trim())) {
      errs.name = 'Only letters and spaces allowed';
    } else if (isNew && cities.some(c => c.name.toLowerCase() === city.name.toLowerCase())) {
      errs.name = 'City name must be unique';
    }

    if (!city.country) {
      errs.country = 'Country selection is required';
    }

    if (city.latitude === '' || !isValidLat(Number(city.latitude))) {
      errs.latitude = 'Latitude must be between -90 and 90';
    }

    if (city.longitude === '' || !isValidLong(Number(city.longitude))) {
      errs.longitude = 'Longitude must be between -180 and 180';
    }

    return errs;
  };

  const handleAddCity = () => {
    const validation = validate(newCity);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const updated = [...cities, newCity];
    setCities(updated);
    localStorage.setItem('cities', JSON.stringify(updated));
    setNewCity({ name: '', country: '', latitude: '', longitude: '' });
    setErrors({});
    setAdding(false);
    setMessage('City added successfully!');
  };

  const toggleFavorite = (city) => {
    const key = city.name + city.country;
    const updated = { ...favorites, [key]: !favorites[key] };
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

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
    setErrors({});
  };

  const handleSave = () => {
    const validation = validate(editedCity, false);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const updated = [...cities];
    updated[editingIndex] = editedCity;
    setCities(updated);
    localStorage.setItem('cities', JSON.stringify(updated));
    setEditingIndex(null);
    setErrors({});
  };

  return (
    <div className="bg-glass">
      <h2 className="mb-3">Add City</h2>
      {message && <Alert variant="success">{message}</Alert>}
      <Button onClick={() => setAdding(true)} className="mb-3">+ Add City</Button>

      <Table striped bordered hover className="weather-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Favorite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adding && (
            <tr>
              <td>
                <Form.Control value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value })} />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </td>
              <td>
                <Form.Select value={newCity.country} onChange={(e) => setNewCity({ ...newCity, country: e.target.value })}>
                  <option value="">-- Select Country --</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </Form.Select>
                {errors.country && <div className="text-danger">{errors.country}</div>}
              </td>
              <td>
                <Form.Control value={newCity.latitude} onChange={(e) => setNewCity({ ...newCity, latitude: e.target.value })} />
                {errors.latitude && <div className="text-danger">{errors.latitude}</div>}
              </td>
              <td>
                <Form.Control value={newCity.longitude} onChange={(e) => setNewCity({ ...newCity, longitude: e.target.value })} />
                {errors.longitude && <div className="text-danger">{errors.longitude}</div>}
              </td>
              <td>—</td>
              <td>
                <Button size="sm" variant="success" onClick={handleAddCity} className="me-2">Save</Button>
                <Button size="sm" variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
              </td>
            </tr>
          )}
          {cities.map((city, index) => {
            const isEditing = editingIndex === index;
            return (
              <tr key={index}>
                <td>
                  {isEditing ? (
                    <Form.Control value={editedCity.name} onChange={(e) => setEditedCity({ ...editedCity, name: e.target.value })} />
                  ) : city.name}
                  {isEditing && errors.name && <div className="text-danger">{errors.name}</div>}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Select value={editedCity.country} onChange={(e) => setEditedCity({ ...editedCity, country: e.target.value })}>
                      <option value="">-- Select Country --</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </Form.Select>
                  ) : city.country}
                  {isEditing && errors.country && <div className="text-danger">{errors.country}</div>}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control value={editedCity.latitude} onChange={(e) => setEditedCity({ ...editedCity, latitude: e.target.value })} />
                  ) : city.latitude}
                  {isEditing && errors.latitude && <div className="text-danger">{errors.latitude}</div>}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control value={editedCity.longitude} onChange={(e) => setEditedCity({ ...editedCity, longitude: e.target.value })} />
                  ) : city.longitude}
                  {isEditing && errors.longitude && <div className="text-danger">{errors.longitude}</div>}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => toggleFavorite(city)}
                    style={{ color: favorites[city.name + city.country] ? 'red' : 'gray' }}
                  >
                    {favorites[city.name + city.country] ? '❤️' : '🤍'}
                  </Button>
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <Button variant="success" size="sm" onClick={handleSave} className="me-2">Save</Button>
                      <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" size="sm" onClick={() => handleEditClick(index)} className="me-2">Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(index)}>Delete</Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );

}

export default AddCityPage;
