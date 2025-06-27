// src/components/LocationPicker.js
import React, { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCRmDazts05Tguqgt0bE-ZrLfMqf6Z6SK8";
const GOOGLE_MAP_ID = "36802ea57aa3e756993e8e4f";

let googleMapsApiPromise = null;

const getNumericLatLng = (latLngLike) => {
  if (!latLngLike) return { lat: NaN, lng: NaN };
  if (typeof latLngLike.lat === "function") {
    return { lat: latLngLike.lat(), lng: latLngLike.lng() };
  }
  return { lat: latLngLike.lat, lng: latLngLike.lng };
};

const LocationPicker = ({ setLatitud, setLongitud, setDireccion }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const searchInputRef = useRef(null);

  const [apiLoaded, setApiLoaded] = useState(false);
  const [markerType, setMarkerType] = useState("advanced");

  useEffect(() => {
    if (window.google && window.google.maps) {
      console.log("LocationPicker: Google Maps API ya está disponible.");
      setApiLoaded(true);
      return;
    }

    if (!googleMapsApiPromise) {
      googleMapsApiPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&callback=initMapCallback&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMapCallback = () => {
          console.log("Google Maps API se ha cargado dinámicamente!");
          resolve();
        };

        return () => {
          delete window.initMapCallback;
        };
      });
    }

    googleMapsApiPromise
      .then(() => {
        setApiLoaded(true);
      })
      .catch((error) => {
        console.error("No se pudo cargar la API de Google Maps:", error);
      });

    return () => {};
  }, []);

  useEffect(() => {
    if (apiLoaded && mapRef.current) {
      if (mapInstance.current) return;

      console.log("LocationPicker: Inicializando Google Map...");

      const defaultLatLng = { lat: -12.0464, lng: -77.0428 };

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: defaultLatLng,
        zoom: 12,
        mapId: GOOGLE_MAP_ID,
      });

      console.log("Instancia del mapa creada:", mapInstance.current);

      try {
        if (
          window.google.maps.marker &&
          window.google.maps.marker.AdvancedMarkerElement
        ) {
          markerInstance.current =
            new window.google.maps.marker.AdvancedMarkerElement({
              map: mapInstance.current,
              position: defaultLatLng,
              gmpDraggable: true,
            });
          setMarkerType("advanced");
          console.log(
            "LocationPicker: AdvancedMarkerElement inicializado correctamente."
          );

          markerInstance.current.addListener("dragend", (e) => {
            const { lat, lng } = getNumericLatLng(
              e.latLng ?? markerInstance.current.position
            );
            updateLocation(lat, lng);
          });
        } else {
          throw new Error(
            "AdvancedMarkerElement no está disponible. Usando marcador estándar."
          );
        }
      } catch (error) {
        console.error(
          "LocationPicker: Falló la inicialización de AdvancedMarkerElement. Volviendo al Marcador estándar.",
          error
        );

        markerInstance.current = new window.google.maps.Marker({
          map: mapInstance.current,
          position: defaultLatLng,
          draggable: true,
        });
        setMarkerType("standard");
        console.log(
          "LocationPicker: Marcador estándar inicializado como alternativa."
        );

        markerInstance.current.addListener("dragend", (e) => {
          const { lat, lng } = getNumericLatLng(e.latLng);
          updateLocation(lat, lng);
        });
      }

      mapInstance.current.addListener("click", (e) => {
        const { lat, lng } = getNumericLatLng(e.latLng);
        updateLocation(lat, lng);
      });

      if (window.google.maps.places && searchInputRef.current) {
        const placeAutocompleteElement = document.createElement(
          "gmp-place-autocomplete"
        );
        placeAutocompleteElement.setAttribute(
          "placeholder",
          "Busca una dirección"
        );
        placeAutocompleteElement.setAttribute("type", "address");
        placeAutocompleteElement.className =
          "block w-full border border-gray-300 rounded-md p-2 shadow-sm";

        if (searchInputRef.current.parentNode) {
          searchInputRef.current.parentNode.replaceChild(
            placeAutocompleteElement,
            searchInputRef.current
          );
          searchInputRef.current = placeAutocompleteElement;
        }

        placeAutocompleteElement.addEventListener("gmp-select", async ({ placePrediction }) => {
            const place = placePrediction.toPlace();
            await place.fetchFields({
              fields: ["location", "formattedAddress", "viewport"],
            });
          
            if (!place.location) {
              console.error("No location found in place.");
              return;
            }
          
            const { lat, lng } = getNumericLatLng(place.location);
            const address = place.formattedAddress;
          
            if (isNaN(lat) || isNaN(lng)) {
              console.error("Lat or Lng is not a number:", { lat, lng });
              return;
            }
          
            if (place.viewport) {
              mapInstance.current.fitBounds(place.viewport);
            } else {
              mapInstance.current.setCenter({ lat, lng });
              mapInstance.current.setZoom(17);
            }
          
            updateLocation(lat, lng, address);
          });
          
      }
    }
  }, [apiLoaded]);

  const updateLocation = async (lat, lng, formattedAddress = null) => {
    setLatitud(lat);
    setLongitud(lng);
    console.log("updateLocation:", { lat, lng, markerType });

    if (markerInstance.current) {
      if (markerType === "advanced") {
        markerInstance.current.position = new window.google.maps.LatLng(lat, lng);
      } else {
        markerInstance.current.setPosition({ lat, lng });
      }

      if (mapInstance.current) {
        window.google.maps.event.trigger(mapInstance.current, "resize");
        mapInstance.current.setCenter({ lat, lng });
      }
    }

    if (!formattedAddress) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({ location: { lat, lng } });
        if (results && results[0]) {
          setDireccion(results[0].formatted_address);
          if (searchInputRef.current?.value !== undefined) {
            searchInputRef.current.value = results[0].formatted_address;
          }
        } else {
          setDireccion("Dirección no encontrada");
          if (searchInputRef.current?.value !== undefined) {
            searchInputRef.current.value = "";
          }
        }
      } catch (error) {
        console.error("Error durante la geocodificación inversa:", error);
        setDireccion("Error al obtener la dirección");
        if (searchInputRef.current?.value !== undefined) {
          searchInputRef.current.value = "";
        }
      }
    } else {
      setDireccion(formattedAddress);
      if (searchInputRef.current?.value !== undefined) {
        searchInputRef.current.value = formattedAddress;
      }
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Busca una dirección o arrastra el marcador"
          className="block w-full border border-gray-300 rounded-md p-2 shadow-sm"
          disabled={!apiLoaded}
        />
      </div>
      <div
        ref={mapRef}
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "8px",
          backgroundColor: "#e0e0e0",
          zIndex: 1,
        }}
        className="border border-gray-300"
      >
        {!apiLoaded && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Cargando mapa... (Si no aparece, verifica las restricciones de tu
            clave API en la consola de Google Cloud)
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
