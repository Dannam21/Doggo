import React, { useContext } from "react";
import bannerDoggo from "../assets/banner-doggo.png";
import Navbar from "../layout/Navbar";
import Adopta from "./Adopta";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleAdoptaClick = () => {
    if (user && user.token) {
      navigate("/dashboard/user");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col w-full bg-orange-50 text-gray-900 font-sans">
      <Navbar />

      <section className="w-full bg-orange-100 text-gray-900 font-sans relative py-10 px-4 md:px-20 flex flex-col md:flex-row items-center justify-center gap-6 overflow-hidden">
        <div className="relative z-10 max-w-3xl text-center md:text-left">
          <h1 className="text-6xl font-black leading-tight mb-6">
            Un match que
            <br />
            cambia dos vidas
            <br />
            para siempre
          </h1>
          <p className="text-gray-700 mb-8 text-xl leading-relaxed">
            Explora mascotas recomendadas especialmente para ti.
            <br />
            ¡Haz match hoy mismo!
            <br />
            Solo toma 60 segundos
          </p>

          <button
            onClick={() => {
              const element = document.getElementById("adopta-section");
              const navbarHeight = 64;
              if (element) {
                const y =
                  element.getBoundingClientRect().top +
                  window.pageYOffset -
                  navbarHeight;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
            className="px-8 py-3 bg-[#f77534] text-white rounded-2xl font-bold hover:bg-orange-500 transition text-xl mr-4"
          >
            Mascotas
          </button>

          <button
            onClick={handleAdoptaClick}
            className="px-8 py-3 bg-[#f77534] text-white rounded-2xl font-bold hover:bg-orange-500 transition text-xl"
          >
            Adopta
          </button>
        </div>

        <div className="relative z-20 w-96">
          <img src={bannerDoggo} alt="Hero" className="w-full object-contain" />
        </div>
      </section>

      <div id="adopta-section">
        <Adopta />
      </div>
      <Footer />
    </main>
  );
}