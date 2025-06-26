import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ícono corregido
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationMarker = ({ setLatitud, setLongitud, setDireccion }) => {
  const [position, setPosition] = useState(null);

  const fetchDireccion = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data?.display_name) {
        setDireccion(data.display_name);
      }
    } catch (err) {
      console.error("Error obteniendo dirección:", err);
      setDireccion("");
    }
  };

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setLatitud(lat);
      setLongitud(lng);
      fetchDireccion(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ setLatitud, setLongitud, setDireccion }) => {
  return (
    <div className="mt-4">
      <MapContainer
        center={[-12.0464, -77.0428]} // Lima por defecto
        zoom={13}
        style={{ height: "300px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker
          setLatitud={setLatitud}
          setLongitud={setLongitud}
          setDireccion={setDireccion}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
