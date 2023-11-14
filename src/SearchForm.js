import React, { useState } from 'react';
import axios from 'axios';

function SearchForm({ serialNumber }) {
  const [wifiPassword, setWifiPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
      const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJhZXgtY29yZSIsImlhdCI6MTY4Nzk2MjIxMSwidWlkIjoiMjBGRDRGMkQtNUUxQS00NDM4LUI3RkUtODQ0N0ZFNzlDQzIzIiwiY2xhaW1zIjpbInVzZXJfaWQ6MjBGRDRGMkQtNUUxQS00NDM4LUI3RkUtODQ0N0ZFNzlDQzIzIiwib3BlcmF0b3JfaWQ6MTk1Q0NBRDUtMDJGQy00REMyLTg1ODktN0Q4NUU0NEZGRTMwIiwicHJvdmlkZXJfaWQ6MTk1Q0NBRDUtMDJGQy00REMyLTg1ODktN0Q4NUU0NEZGRTMwIiwicm9sZTpmbm8iLCJyb2xlOmlzcCJdLCJleHAiOjE3MTk0OTgyMTF9.0_XZiz_eWUdU9F5EhOdfWhgtDOQuDFU1RKmBHLTjpDx_WdeDWjU87BJUMKJSDp9I8kLbylDBBJr0ucdnHl1FMA'; // Replace with your actual token
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`https://preprod.fno.dev.aex.systems/services?q=${encodeURIComponent(serialNumber)}`, { headers });

      if (response.data && response.data.items.length > 0) {
        const wifiItem = response.data.items.find((item) => item.serial_number === serialNumber);

        if (wifiItem) {
          setWifiPassword(wifiItem.wifi_password);
          setErrorMessage('');
        } else {
          setErrorMessage("Serial number doesn't exist");
          setWifiPassword('');
        }
      } else {
        setErrorMessage("Serial number doesn't exist");
        setWifiPassword('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={serialNumber} readOnly />
      <button onClick={handleSearch}>Search</button>
      {errorMessage && <p>{errorMessage}</p>}
      {wifiPassword && (
        <div>
          <h2>Wi-Fi Password:</h2>
          <p>{wifiPassword}</p>
        </div>
      )}
    </div>
  );
}

export default SearchForm;
