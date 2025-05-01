import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function AddCityPage() {
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      // هون ممكن تبعثي الداتا لسيرفر أو تضيفيها لمصفوفة
      console.log('City added:', city);
      setSubmitted(true);
      setCity('');
    }
  };

  return (
    <div>
      <h2>Add a New City</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formCityName">
          <Form.Label>City Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add City
        </Button>
      </Form>
      {submitted && <Alert variant="success" className="mt-3">City added successfully!</Alert>}
    </div>
  );
}

export default AddCityPage;
