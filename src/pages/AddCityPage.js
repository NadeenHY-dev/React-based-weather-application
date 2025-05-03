import { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

function AddCityPage() {
  const [cities, setCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedCity, setEditedCity] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const entries = data.map(info => ({
          name: info.name.common,
          code: info.cca2,
          latitude: info.latlng?.[0] || '',
          longitude: info.latlng?.[1] || ''
        }));

        setCities(entries);

        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
        setFavorites(savedFavorites);
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

  const toggleFavorite = (city) => {
    const cityKey = city.name + city.code;

    const updatedFavorites = {
      ...favorites,
      [cityKey]: !favorites[cityKey],
    };

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    const saved = JSON.parse(localStorage.getItem('cities') || '[]');
    const exists = saved.some(
      c => c.name === city.name && c.code === city.code
    );

    let updated;
    if (exists) {
      updated = saved.filter(
        c => !(c.name === city.name && c.code === city.code)
      );
    } else {
      updated = [...saved, city];
    }

    localStorage.setItem('cities', JSON.stringify(updated));
  };

  return (
    <div>
      <h2 className="mb-4">City List from API</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Country Name</th>
            <th>Country Code</th>
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
                    onChange={(e) =>
                      setEditedCity({ ...editedCity, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setEditedCity({ ...editedCity, latitude: e.target.value })
                    }
                  />
                ) : (
                  city.latitude
                )}
              </td>
              <td>
                {editingIndex === index ? (
                  <Form.Control
                    value={editedCity.longitude || ''}
                    onChange={(e) =>
                      setEditedCity({ ...editedCity, longitude: e.target.value })
                    }
                  />
                ) : (
                  city.longitude
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="link"
                  onClick={() => toggleFavorite(city)}
                  style={{
                    color: favorites[city.name + city.code] ? 'red' : 'gray',
                  }}
                >
                  {favorites[city.name + city.code] ? '❤️' : '🤍'}
                </Button>
              </td>
              <td>
                {editingIndex === index ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSave}
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditClick(index)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
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
