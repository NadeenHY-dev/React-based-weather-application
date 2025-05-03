import { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

function AddCityPage() {
  const staticCities = [
    { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
    { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
    { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
    { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
    { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 }
  ];

  const [cities, setCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const [favorites, setFavorites] = useState({});
  const [addingCity, setAddingCity] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', country: '', latitude: '', longitude: '' });

  useEffect(() => {
    setCities(staticCities);
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites(savedFavorites);
  }, []);

  const handleDelete = (index) => {
    const updated = [...cities];
    updated.splice(index, 1);
    setCities(updated);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedCity({ ...cities[index] });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedCity({});
  };

  const handleSave = () => {
    const updated = [...cities];
    updated[editingIndex] = editedCity;
    setCities(updated);
    setEditingIndex(null);
  };

  const toggleFavorite = (city) => {
    const cityKey = city.name + city.country;
    const updatedFavorites = { ...favorites, [cityKey]: !favorites[cityKey] };
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    const saved = JSON.parse(localStorage.getItem('cities') || '[]');
    const exists = saved.some(c => c.name === city.name && c.country === city.country);
    const updated = exists
      ? saved.filter(c => !(c.name === city.name && c.country === city.country))
      : [...saved, city];
    localStorage.setItem('cities', JSON.stringify(updated));
  };

  const handleAddCity = () => {
    if (!newCity.name || !newCity.country || newCity.latitude === '' || newCity.longitude === '') {
      alert('Please fill in all fields');
      return;
    }
    setCities([...cities, newCity]);
    setNewCity({ name: '', country: '', latitude: '', longitude: '' });
    setAddingCity(false);
  };

  return (
    <div>
      <h2 className="mb-4">City List</h2>
      <Button variant="success" className="mb-3" onClick={() => setAddingCity(true)}>
        + Add City
      </Button>
      <Table striped bordered hover responsive>
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
          {addingCity && (
            <tr>
              <td><Form.Control value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value })} placeholder="City" /></td>
              <td><Form.Control value={newCity.country} onChange={(e) => setNewCity({ ...newCity, country: e.target.value })} placeholder="Country" /></td>
              <td><Form.Control value={newCity.latitude} type="number" onChange={(e) => setNewCity({ ...newCity, latitude: e.target.value })} placeholder="Lat" /></td>
              <td><Form.Control value={newCity.longitude} type="number" onChange={(e) => setNewCity({ ...newCity, longitude: e.target.value })} placeholder="Long" /></td>
              <td>–</td>
              <td>
                <Button size="sm" variant="success" onClick={handleAddCity} className="me-2">Save</Button>
                <Button size="sm" variant="secondary" onClick={() => setAddingCity(false)}>Cancel</Button>
              </td>
            </tr>
          )}
          {cities.map((city, index) => (
            <tr key={index}>
              <td>{editingIndex === index ? <Form.Control value={editedCity.name} onChange={(e) => setEditedCity({ ...editedCity, name: e.target.value })} /> : city.name}</td>
              <td>{editingIndex === index ? <Form.Control value={editedCity.country} onChange={(e) => setEditedCity({ ...editedCity, country: e.target.value })} /> : city.country}</td>
              <td>{editingIndex === index ? <Form.Control value={editedCity.latitude} onChange={(e) => setEditedCity({ ...editedCity, latitude: e.target.value })} /> : city.latitude}</td>
              <td>{editingIndex === index ? <Form.Control value={editedCity.longitude} onChange={(e) => setEditedCity({ ...editedCity, longitude: e.target.value })} /> : city.longitude}</td>
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
                {editingIndex === index ? (
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
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AddCityPage;
