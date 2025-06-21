import { useLocation } from "react-router-dom";

export default function DonacionExitosa() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const donacionId = params.get("donacion_id");

  return (
    <div>
      <h1>¡Gracias por tu donación!</h1>
      <p>Tu donación fue registrada correctamente con ID: {donacionId}</p>
    </div>
  );
}
