import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../layout/Navbar';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    estiloVida: '',
    espacio: '',
    experiencia: '',
    tiempoDisponible: '',
    alergias: 'no',
    preferenciaTamanio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar las respuestas al backend
    console.log(formData);
    navigate('/resultados-mascotas'); // Redirige a resultados
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-black">Cuestionario de Compatibilidad</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1">¿Cuál es tu estilo de vida?</label>
              <select name="estiloVida" onChange={handleChange} value={formData.estiloVida} required className="w-full p-2 border rounded-md">
                <option value="">Selecciona una opción</option>
                <option value="activo">Activo</option>
                <option value="relajado">Relajado</option>
                <option value="equilibrado">Equilibrado</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">¿Tienes espacio al aire libre?</label>
              <select name="espacio" onChange={handleChange} value={formData.espacio} required className="w-full p-2 border rounded-md">
                <option value="">Selecciona una opción</option>
                <option value="departamento">Departamento</option>
                <option value="casa-con-jardin">Casa con jardín</option>
                <option value="campo">Campo / zona rural</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">¿Tienes experiencia previa con mascotas?</label>
              <select name="experiencia" onChange={handleChange} value={formData.experiencia} required className="w-full p-2 border rounded-md">
                <option value="">Selecciona una opción</option>
                <option value="nueva">No, sería mi primera</option>
                <option value="poca">Un poco</option>
                <option value="mucha">Mucha experiencia</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">¿Cuánto tiempo tienes disponible al día?</label>
              <select name="tiempoDisponible" onChange={handleChange} value={formData.tiempoDisponible} required className="w-full p-2 border rounded-md">
                <option value="">Selecciona una opción</option>
                <option value="menos1">Menos de 1 hora</option>
                <option value="1a3">Entre 1 y 3 horas</option>
                <option value="mas3">Más de 3 horas</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">¿Tienes alergias a animales?</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="alergias"
                    value="no"
                    checked={formData.alergias === 'no'}
                    onChange={handleChange}
                  /> No
                </label>
                <label>
                  <input
                    type="radio"
                    name="alergias"
                    value="si"
                    checked={formData.alergias === 'si'}
                    onChange={handleChange}
                  /> Sí
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">¿Qué tamaño de mascota prefieres?</label>
              <select name="preferenciaTamanio" onChange={handleChange} value={formData.preferenciaTamanio} required className="w-full p-2 border rounded-md">
                <option value="">Selecciona una opción</option>
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
                <option value="indiferente">Indiferente</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition">
              Enviar respuestas
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Questionnaire;
