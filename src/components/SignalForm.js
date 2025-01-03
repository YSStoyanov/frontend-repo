import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../GlobalStyles.css';

// Икони за категориите
import urbanIcon from '../assets/urban-environment.png';
import ecologyIcon from '../assets/ecology.png';
import wasteIcon from '../assets/waste-management.png';
import incidentIcon from '../assets/incidents.png';
import otherIcon from '../assets/other.png';

const categoryIcons = {
  'Градска среда': urbanIcon,
  'Екология': ecologyIcon,
  'Чистота': wasteIcon,
  'Инцидент': incidentIcon,
  'Други': otherIcon,
};

const SignalForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    category: 'Градска среда',
    description: '',
    image: null,
    lat: null,
    lng: null,
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Зареждане на GeoJSON
  useEffect(() => {
    async function loadGeoJson() {
      try {
        const response = await fetch('/public/data/Kavarna_boundary_corrected.geojson');
        const data = await response.json();
        if (!response.ok) throw new Error('Неуспешно зареждане на GeoJSON файла.');

        if (!data || data.type !== 'FeatureCollection') {
          throw new Error('Невалиден GeoJSON формат.');
        }

        setGeoJsonData(data);
      } catch (error) {
        console.error('Грешка при зареждане на GeoJSON:', error);
      }
    }

    loadGeoJson();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:4000/api/signals', data);
      setStatusMessage('Сигналът е успешно изпратен!');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting signal:', error.response ? error.response.data : error.message);
      setStatusMessage('Грешка при изпращането на сигнала. Моля, опитайте отново.');
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click: (e) => {
        setFormData({ ...formData, lat: e.latlng.lat, lng: e.latlng.lng });
        alert(`Избрано местоположение: ${e.latlng.lat}, ${e.latlng.lng}`);
      },
    });
    return null;
  };

  const getCategoryIcon = (category) => {
    return L.icon({
      iconUrl: categoryIcons[category],
      iconSize: [32, 32],
    });
  };

  const geoJsonStyle = {
    color: '#0000ff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.1,
  };

  return (
    <div className="container">
      <h2>Подаване на сигнал</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Име:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="contact">Имейл за Контакт:</label>
          <input type="email" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="phone">Телефонен номер:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category">Категория:</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            {Object.keys(categoryIcons).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description">Описание:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="image">Снимка:</label>
          <input type="file" id="image" name="image" onChange={handleFileChange} />
        </div>
        <div className="map-container">
          <MapContainer
            center={[43.43, 28.34]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {geoJsonData && <GeoJSON data={geoJsonData} style={geoJsonStyle} />}
            {formData.lat && formData.lng && (
              <Marker position={[formData.lat, formData.lng]} icon={getCategoryIcon(formData.category)} />
            )}
            <LocationSelector />
          </MapContainer>
        </div>
        <button type="submit">Изпрати</button>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default SignalForm;