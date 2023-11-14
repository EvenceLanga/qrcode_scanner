import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import './App.css';

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [wifiPassword, setWifiPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    requestCameraPermission();
  }, []);

  const handleSearch = async () => {
    try {
      const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJhZXgtY29yZSIsImlhdCI6MTY4Nzk2MjIxMSwidWlkIjoiMjBGRDRGMkQtNUUxQS00NDM4LUI3RkUtODQ0N0ZFNzlDQzIzIiwiY2xhaW1zIjpbInVzZXJfaWQ6MjBGRDRGMkQtNUUxQS00NDM4LUI3RkUtODQ0N0ZFNzlDQzIzIiwib3BlcmF0b3JfaWQ6MTk1Q0NBRDUtMDJGQy00REMyLTg1ODktN0Q4NUU0NEZGRTMwIiwicHJvdmlkZXJfaWQ6MTk1Q0NBRDUtMDJGQy00REMyLTg1ODktN0Q4NUU0NEZGRTMwIiwicm9sZTpmbm8iLCJyb2xlOmlzcCJdLCJleHAiOjE3MTk0OTgyMTF9.0_XZiz_eWUdU9F5EhOdfWhgtDOQuDFU1RKmBHLTjpDx_WdeDWjU87BJUMKJSDp9I8kLbylDBBJr0ucdnHl1FMA'; // Replace with your actual token
      const headers = { Authorization: `Bearer ${token}` };

      const serialNumber = scanResult.slice(-16);

      const response = await axios.get(
        `https://preprod.fno.dev.aex.systems/services?q=${serialNumber}`,
        { headers }
      );

      if (response.data && response.data.items.length > 0) {
        const wifiItem = response.data.items.find(
          (item) => item.status_id === 2 && item.wifi_password
        );

        if (wifiItem) {
          setWifiPassword(wifiItem.wifi_password);
          setErrorMessage('');
        } else {
          setErrorMessage("Serial number doesn't exist or no Wi-Fi password available");
          setWifiPassword('');
        }
      } else {
        setErrorMessage("Serial number doesn't exist or no Wi-Fi password available");
        setWifiPassword('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (hasCameraPermission) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      let isScanning = true;

      scanner.render(success, error);

      function success(result) {
        if (isScanning) {
          scanner.clear();
          setScanResult(result);
          isScanning = false; // Set isScanning to false to stop further scanning
        }
      }

      function error(err) {
        console.warn(err);
      }
    }
  }, [hasCameraPermission]);

  return (
    <div className="App">
      <h1>QR Scanning Code</h1>
      {scanResult ? (
        <div>
          <p>Serial Number: {scanResult.slice(-16)}</p>
          <button onClick={handleSearch}>Search</button>
          {errorMessage && <p>{errorMessage}</p>}
          {wifiPassword && (
            <div>
              <h2>Wi-Fi Password:</h2>
              <p>{wifiPassword}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {hasCameraPermission ? (
            <div id="reader"></div>
          ) : (
            <p>Camera permission denied.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
