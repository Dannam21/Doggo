import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "300px" };
const center = { lat: -12.0464, lng: -77.0428 }; // Lima

export default function LocationPicker(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ⚠️ no quemes la key en código
    libraries,
  });

  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded)  return <p>Cargando mapa…</p>;

  return <LocationPickerInner {...props} />;
}

function LocationPickerInner({ setLatitud, setLongitud, setDireccion }) {
  const [marker, setMarker] = useState(null);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = getLatLng(results[0]);

    setMarker({ lat, lng });
    setLatitud(lat);
    setLongitud(lng);
    setDireccion(description);
  };

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setMarker({ lat, lng });
    setLatitud(lat);
    setLongitud(lng);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setDireccion(results[0].formatted_address);
      } else {
        setDireccion("No se pudo encontrar la dirección");
      }
    });
  }, [setLatitud, setLongitud, setDireccion]);

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Buscar dirección…"
        className="w-full border border-gray-300 rounded-md p-2 shadow-sm"
      />

      {status === "OK" && (
        <ul className="bg-white border rounded shadow max-h-40 overflow-y-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={marker || center}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}
