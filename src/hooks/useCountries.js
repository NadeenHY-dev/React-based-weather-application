import { useEffect, useState } from 'react';

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
