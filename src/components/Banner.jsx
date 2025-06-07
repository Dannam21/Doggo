import React from "react";
import bannerDoggo from "../assets/banner-doggo.png";

const Banner = () => {
  return (
    <section className="w-full bg-orange-100 py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md md:w-1/2">
          <h1 className="text-2xl font-bold leading-snug text-black mb-4">
            Un match que<br />cambia dos vidas<br />para siempre
          </h1>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            Explora mascotas recomendadas especialmente para ti.
            <br />
            ¡Haz match hoy mismo!
            <br />
            Solo toma 60 segundos
          </p>

          <button className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium text-sm hover:bg-orange-600 transition">
            Adopta
          </button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={bannerDoggo}
            alt="Hero"
            className="w-40 h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
