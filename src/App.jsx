import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute"; // Asegúrate de que la ruta sea correcta

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterUser from "./pages/RegisterUser";
import RegisterCompany from "./pages/RegisterCompany";

// Páginas de empresa
import CompanyDoggos from "./pages/empresa/CompanyDoggos";
import CompanyHome from "./pages/empresa/CompanyHome";
import CompanyCalendar from "./pages/empresa/CompanyCalendar";
import CompanyStatistics from "./pages/empresa/CompanyStatistics";
import CompanyMessages from "./pages/empresa/CompanyMessages";
import DashboardCompany from "./pages/empresa/DashboardCompany";
import Adddoggo from "./pages/empresa/Adddoggo";

// Páginas de usuario
import User from "./pages/usuario/DashboardUser";
import Questionnaire from "./pages/cuestionario/Questionnaire";
import ListDoggo from "./pages/empresa/ListDoggo";
import EditDoggo from "./pages/empresa/EditDoggo";
import DoggoUser from "./pages/usuario/DoggoUser";
import MatchUser from "./pages/usuario/MatchUser";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Registro */}
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/cuestionario" element={ <Questionnaire />}/>


          <Route
            path="/company/doggos"
            element={
              <ProtectedRoute>
                <CompanyDoggos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/editdoggos"
            element={
              <ProtectedRoute>
                <EditDoggo />
              </ProtectedRoute>
            }
          />


          <Route
            path="/company/home"
            element={
              <ProtectedRoute>
                <CompanyHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/calendar"
            element={
              <ProtectedRoute>
                <CompanyCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/statistics"
            element={
              <ProtectedRoute>
                <CompanyStatistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/messages"
            element={
              <ProtectedRoute>
                <CompanyMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/cambiar"
            element={
              <ProtectedRoute>
                <DashboardCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/doggoform"
            element={
              <ProtectedRoute>
                <DashboardCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/adddoggo"
            element={
              <ProtectedRoute>
                <Adddoggo />
              </ProtectedRoute>
            }
          />

            <Route
            path="/company/listdoggo"
            element={
              <ProtectedRoute>
                <ListDoggo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doggoUser/:dogId"
            element={
              <ProtectedRoute>
                <DoggoUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doggoMatch/:dogId"
            element={
              <ProtectedRoute>
                <MatchUser />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
