import React, { useState, useEffect, useContext } from "react";
import SidebarCompany from "../../components/SidebarCompany";
import AddDoggoForm from "../../components/AddDoggoForm";
import { UserContext } from "../../context/UserContext";


export default function ListDoggo() {
    const { user } = useContext(UserContext);
    const token = user?.token;
    const albergueId = user?.albergue_id;
    const [expandedTags, setExpandedTags] = useState({});

    const [dogs, setDogs] = useState([]);
    
    const toggleTags = (id) => {
        setExpandedTags((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };

    useEffect(() => {
        if (!token || !albergueId) return;
    
        fetch(`http://localhost:8000/mascotas/albergue/${albergueId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error al cargar mascotas");
            return res.json();
        })
        .then((data) => {
            const enriched = data.map((m) => ({
            id: m.id,
            nombre: m.nombre,
            edad: m.edad,
            especie: m.especie,
            imageUrl: `http://localhost:8000/imagenes/${m.imagen_id}`,
            etiquetas: m.etiquetas || [],
            }));
            setDogs(enriched);
        })
        .catch((err) => console.error("Fetch mascotas:", err.message));
    }, [token, albergueId]);
    
    const handleNewDog = (createdDog) => {
        setDogs((prev) => [createdDog, ...prev]);
    };
    
    return (
        <div className="flex min-h-screen bg-[#fdf0df] ml-64">
        <SidebarCompany />
    
        <main className="flex-1 px-10 py-10 space-y-10">
            <h1 className="text-3xl font-extrabold text-[#2e2e2e]">🐶 Lista de Doggos</h1>
    
            <section>
            <h2 className="text-xl font-semibold mb-4">🐾 Perritos Registrados</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dogs.map((dog) => (
                <div
                    key={dog.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition"
                >
                    <img
                    src={dog.imageUrl}
                    alt={dog.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                    <h3 className="text-lg font-semibold">{dog.nombre}</h3>
                    <p className="text-sm text-gray-600">Edad: {dog.edad} años</p>
                    <p className="text-sm text-gray-600">Especie: {dog.especie}</p>
                    <div className="mt-2">
                        {(expandedTags[dog.id] ? dog.etiquetas : dog.etiquetas.slice(0, 5)).map(
                            (tag, index) => (
                            <span
                                key={index}
                                className="inline-block bg-[#f77534] text-white text-xs px-2 py-1 rounded-full mr-1 mb-1"
                            >
                                {tag}
                            </span>
                            )
                        )}

                        {dog.etiquetas.length > 5 && (
                           <button
                            onClick={() => toggleTags(dog.id)}
                            className="bg-[#f77534] text-white rounded-full mr-1 mb-1 hover:bg-[#e76628]"
                            style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                lineHeight: "1rem",
                                fontFamily: "inherit",
                                border: "1px solid transparent",
                                cursor: "pointer",
                            }}
                            >
                            {expandedTags[dog.id] ? "ver menos" : "..."}
                            </button>             
                        )}
                    </div>

                    </div>
                </div>
                ))}
            </div>
            </section>
            
        </main>
        </div>
    );
}