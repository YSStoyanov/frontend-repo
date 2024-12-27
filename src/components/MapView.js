import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Импорт на изображенията
import urbanEnvironmentIcon from '../assets/urban-environment.png';
import ecologyIcon from '../assets/ecology.png';
import wasteManagementIcon from '../assets/waste-management.png';
import incidentsIcon from '../assets/incidents.png';
import otherIcon from '../assets/other.png';

// Икона за текуща локация
const userLocationIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg', // Примерна икона
  iconSize: [40, 40],
  iconAnchor: [30, 30],
  popupAnchor: [0, -10],
});

// Функция за избор на подходящата икона по категория
const getIconByCategory = (category) => {
  const icons = {
    'Градска среда': urbanEnvironmentIcon,
    'Екология': ecologyIcon,
    'Сметосъбиране': wasteManagementIcon,
    'Инциденти': incidentsIcon,
    'Друго': otherIcon,
  };

  return new L.Icon({
    iconUrl: icons[category] || otherIcon, // Ако категорията липсва, използвай "Друго"
    iconSize: [40, 40], // Размер на маркерите
    iconAnchor: [20, 40], // Център на маркера
    popupAnchor: [0, -40], // Място, където се отваря popup-а
  });
};

// Слушател на събития за картата
const LocationSelector = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });

  return null; // Не рендерираме нищо
};

// Стил за GeoJSON
const geoJsonStyle = {
  color: '#0000ff', // Синя граница
  weight: 3,
  opacity: 1,
  fillOpacity: 0.1, // Полупрозрачен запълващ цвят
};

const MapView = ({ geoJsonData, markers, onLocationSelect, initialPosition }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Грешка при получаване на геолокация:', error);
      }
    );
  }, []);

  return (
    <MapContainer
      center={initialPosition || [43.4265, 28.3392]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationSelector onLocationSelect={onLocationSelect} />
      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={geoJsonStyle}
        />
      )}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
          <Popup>
            <b>Вие сте тук</b>
          </Popup>
        </Marker>
      )}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={getIconByCategory(marker.category)}
        >
          <Popup>
            <b>{marker.category}</b>: {marker.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;