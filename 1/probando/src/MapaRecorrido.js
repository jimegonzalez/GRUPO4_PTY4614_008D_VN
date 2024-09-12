import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapaRecorrido({ recorrido, setRecorrido }) {
  const [ubicacionActual, setUbicacionActual] = useState([51.505, -0.09]); // Coordenadas iniciales

  useEffect(() => {
    const obtenerUbicacion = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const nuevaUbicacion = [position.coords.latitude, position.coords.longitude];
            setUbicacionActual(nuevaUbicacion);
            setRecorrido((prevRecorrido) => [...prevRecorrido, nuevaUbicacion]);
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.error('Geolocalización no soportada por este navegador.');
      }
    };

    obtenerUbicacion();
  }, [setRecorrido]);

  return (
    <div>
      <MapContainer 
        center={ubicacionActual} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}  // Asegúrate de que el mapa tenga tamaño definido
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={ubicacionActual} />
        {/* Renderizar Polyline solo si hay más de 1 punto en el recorrido */}
        {recorrido && recorrido.length > 1 && (
          <Polyline positions={recorrido} color="blue" />
        )}
      </MapContainer>
    </div>
  );
}

export default MapaRecorrido;


