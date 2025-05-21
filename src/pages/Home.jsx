import bannerDoggo from "../assets/banner-doggo.png";
import Navbar from "../layout/Navbar";
import Adopta from "./Adopta";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col w-full bg-orange-50 text-gray-900 font-sans">
      <Navbar />

      <section className="w-full h-[94vh] bg-orange-100 text-gray-900 font-sans relative py-10 px-4 md:px-20 flex flex-col md:flex-row items-center justify-center gap-6 overflow-hidden">

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h1 className="text-4xl font-black leading-tight mb-4">
            Un match que<br />cambia dos vidas<br />para siempre
          </h1>
          <p className="text-gray-700 mb-6">
            Explora mascotas recomendadas especialmente para ti.<br />
            ¡Haz match hoy mismo!<br />
            Solo toma 60 segundos.
          </p>
          <button
            onClick={() => {
              const element = document.getElementById("adopta-section");
              const navbarHeight = 64; //para ajusta este valor a la altura real de la seccion adopta
              if (element) {
                const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}

            className="px-8 py-2 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transition text-2xl mr-4 ;"
            
          >
          Mascotas
          </button>


          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transition"
          >
            Adopta
          </button>
        </div>

        {/* Imagen */}
        <div className="relative z-20 w-96 md:w-128">
          <img src={bannerDoggo} alt="Hero" className="w-full object-contain" />
        </div>

      </section>

      <div id="adopta-section">
        <Adopta />
      </div>
    </main>
  );
}
