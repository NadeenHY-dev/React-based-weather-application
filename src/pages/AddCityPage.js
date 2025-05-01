import { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

function CityTablePage() {
  const [cities, setCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    fetch('https://api.first.org/data/v1/countries')
      .then(res => res.json())
      .then(data => {
        const entries = Object.entries(data.data).map(([code, info]) => ({
          name: info.country,
          code,
          latitude: '',
          longitude: ''
        }));
        setCities(entries);
      });
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

  const toggleFavorite = (index) => {
    setFavorites(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div>
      <h2 className="mb-4">City List from API</h2>
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
          {cities.map((city, index) => (
            <tr key={index}>
              <td>
                {editingIndex === index ? (
                  <Form.Control
                    value={editedCity.name}
                    onChange={(e) => setEditedCity({ ...editedCity, name: e.target.value })}
                  />
                ) : (
                  city.name
                )}
              </td>
              <td>{city.code}</td>
              <td>
                {editingIndex === index ? (
                  <Form.Control
                    value={editedCity.latitude || ''}
                    onChange={(e) => setEditedCity({ ...editedCity, latitude: e.target.value })}
                  />
                ) : (
                  city.latitude
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <Form.Control
                    value={editedCity.longitude || ''}
                    onChange={(e) => setEditedCity({ ...editedCity, longitude: e.target.value })}
                  />
                ) : (
                  city.longitude
                )}
              </td>
              <td>
                <Button variant="link" onClick={() => toggleFavorite(index)}>
                  {favorites[index] ? '❤️' : '🤍'}
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

export default CityTablePage;
