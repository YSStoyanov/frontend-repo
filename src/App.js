import React, { useEffect, useState } from 'react';
import MapView from './components/MapView';
import SignalForm from './components/SignalForm';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import './App.css';
import { Oval } from 'react-loader-spinner';

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSignals = async (status = 'approved') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/signals?status=${status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMarkers(data);
    } catch (error) {
      console.error('Error fetching signals:', error);
      setError('Неуспешно зареждане на сигнали. Опитайте отново.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/data/Kavarna_boundary_corrected.geojson')
      .then((response) => response.json())
      .then((data) => setGeoJsonData(data))
      .catch((error) => console.error('Error loading GeoJSON:', error));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Грешка при получаване на локация:', error);
      }
    );

    fetchSignals();
  }, []);

  const handleAddMarker = (markerData) => {
    fetch('http://localhost:4000/api/signals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(markerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert('Сигналът е подаден успешно!');
        fetchSignals();
      })
      .catch((error) => console.error('Error adding signal:', error));
  };

  return (
    <div className="app-container">
      <Header onAdminAccess={() => setIsAdminPanelVisible(!isAdminPanelVisible)} />
      {!isAdminPanelVisible && (
        <>
          <div className={`form-drawer ${isFormVisible ? 'open' : ''}`}>
            <SignalForm
              onAddMarker={handleAddMarker}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              onClose={() => setIsFormVisible(false)}
            />
          </div>
          <button
            className="toggle-form-btn"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? '✖ Затвори формата' : '➕ Добави сигнал'}
          </button>
          {isLoading ? (
            <div className="loading-spinner">
              <Oval
                height={80}
                width={80}
                color="#007bff"
                visible={true}
                ariaLabel="loading"
              />
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <MapView
              geoJsonData={geoJsonData}
              markers={markers}
              onLocationSelect={(location) => setSelectedLocation(location)}
              initialPosition={userLocation}
            />
          )}
        </>
      )}
      {isAdminPanelVisible && <AdminPanel onSignalApprove={fetchSignals} />}
    </div>
  );
};

export default App;