import SidebarCompany from "../../components/SidebarCompany";
import AddDoggoForm from "../../components/AddDoggoForm";
import { useState } from "react";

export default function DashboardCompany() {

  return (
    <div className="flex min-h-screen bg-[#fdf0df]">
      <SidebarCompany />

      <main className="flex-1 px-10 py-10 space-y-10">
        <h1 className="text-3xl font-extrabold text-[#2e2e2e]">🐶 Añadir Doggos</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">🐾 Perritos Registrados</h2>

        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">➕ Registrar Nuevo Doggo</h2>
          <AddDoggoForm />
        </section>
      </main>
    </div>
  );
}
