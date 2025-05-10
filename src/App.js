import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import AddCityPage from './pages/AddCityPage';
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

/**
 * The main application component.
 * Sets up routing using React Router and displays a navigation bar and pages.
 *
 * @component
 * @returns {JSX.Element} The rendered application with navigation and route-based pages.
 */
function App() {
  return (
    <Router>
      <NavigationBar />
      <Container className="mt-4">
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<HomePage />} />

          {/* Route for the page where users can add a city */}
          <Route path="/add" element={<AddCityPage />} />

          {/* Route for the about page */}
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
