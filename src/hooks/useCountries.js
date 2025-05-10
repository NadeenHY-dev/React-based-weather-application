import { useEffect, useState } from 'react';

/**
 * Custom React hook to fetch a list of countries from an external API.
 * Returns an array of country objects with `code` and `name` properties.
 *
 * @hook
 * @returns {Array<{ code: string, name: string }>} Array of countries
 */
function useCountries() {
  const [countries, setCountries] = useState([]);

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

  return countries;
}

export default useCountries;
