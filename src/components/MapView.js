import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geoJsonData from '../data/Kavarna_boundary_corrected.geojson'; // Ensure the path is correct

// Импортиране на икони
import hereIcon from '../assets/here.png';
import urbanIcon from '../assets/urban-environment.png';
import ecologyIcon from '../assets/ecology.png';
import wasteIcon from '../assets/waste-management.png';
import incidentIcon from '../assets/incidents.png';
import otherIcon from '../assets/other.png';

// Създаване на икони
const userLocationIcon = L.icon({
  iconUrl: hereIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const categoryIcons = {
  'Градска среда': L.icon({
    iconUrl: urbanIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  'Екология': L.icon({
    iconUrl: ecologyIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  'Сметосъбиране': L.icon({
    iconUrl: wasteIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  'Инциденти': L.icon({
    iconUrl: incidentIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
  'Друго': L.icon({
    iconUrl: otherIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  }),
};

const fallbackIcon = L.icon({
  iconUrl: otherIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Function to validate GeoJSON data
const isValidGeoJson = (geoJson) => {
  return geoJson && geoJson.type === 'FeatureCollection' && Array.isArray(geoJson.features);
};

// Стил за GeoJSON
const geoJsonStyle = {
  color: '#0000ff',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.2,
  fillColor: '#00ff00', // Added fill color for the territory
  filter: 'none', // Ensure no filter is applied to the GeoJSON layer
};

const MapView = ({ markers }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [geoJsonError, setGeoJsonError] = useState(false);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    // Получаване на текуща локация
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  }, []);

  useEffect(() => {
    // Зареждане на GeoJSON данни
    fetch(geoJsonData)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (isValidGeoJson(data)) {
          setGeoJson(data);
        } else {
          throw new Error('Invalid GeoJSON data');
        }
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setGeoJsonError(true);
      });
  }, []);

  return (
    <MapContainer
      center={[43.4265, 28.3392]} // Център на картата
      zoom={12}
      style={{ height: '100vh', width: '100%' }} // Removed grayscale filter
    >
      {/* Сателитен слой от Mapbox */}
      <TileLayer
        url="https://api.mapbox.com/styles/v1/ysstoyanov/cm56qys5500hp01s96ew1dtss/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieXNzdG95YW5vdiIsImEiOiJjbTU2cThzc2IzODU4MmtzZDNzOHBnemd2In0.R-tPZunCGFojSsgd-yA1Kg"
        attribution="&copy; <a href='https://www.mapbox.com/'>Mapbox</a>"
      />

      {/* Граници на Каварна */}
      {!geoJsonError && geoJson && (
        <GeoJSON data={geoJson} style={geoJsonStyle} />
      )}
      {geoJsonError && (
        <Popup position={[43.4265, 28.3392]}>
          <p>Error loading GeoJSON data.</p>
        </Popup>
      )}

      {/* Текуща локация */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
          <Popup>Текущата ви локация</Popup>
        </Marker>
      )}

      {/* Маркери за сигнали */}
      {Array.isArray(markers) && markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={categoryIcons[marker.category] || fallbackIcon}
        >
          <Popup>
            <b>{marker.category}</b>
            <br />
            {marker.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;