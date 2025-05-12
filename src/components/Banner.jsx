import React from "react";
import bannerDoggo from "../assets/banner-doggo.png";

const Banner = () => {
  return (
    <section className="w-full bg-orange-100 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Texto */}
        <div className="max-w-lg md:w-1/2">
          <h1 className="text-4xl font-extrabold leading-tight text-black mb-6">
            Un match que<br />cambia dos vidas<br />para siempre
          </h1>
          <p className="text-gray-700 mb-6 text-base leading-relaxed">
            Explora mascotas recomendadas especialmente para ti.
            <br />
            ¡Haz match hoy mismo!
            <br />
            Solo toma 60 segundos.
          </p>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition">
  Adopta
</button>

        </div>

        {/* Imagen */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={bannerDoggo}
            alt="Hero"
            className="w-72 h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
