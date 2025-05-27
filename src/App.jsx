import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
// Pages
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyDoggos from "./pages/empresa/CompanyDoggos";
import User from "./pages/usuario/DashboardUser";
import Questionnaire from "./pages/cuestionario/Questionnaire";
import RegisterUser from './pages/RegisterUser';
import RegisterCompany from './pages/RegisterCompany';
import CompanyDashboard from "./pages/empresa/CompanyDashboard";
import DashboardCompany from "./pages/empresa/DashboardCompany";
import CompanyHome from "./pages/empresa/CompanyHome";
import CompanyStatistics from "./pages/empresa/CompanyStatistics";
import CompanyCalendar from "./pages/empresa/CompanyCalendar";
import CompanyMessages from "./pages/empresa/CompanyMessages";
import Adddoggo from "./pages/empresa/Adddoggo";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
            {/* Web */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

            {/* Register */}
          <Route path="/register" element={<Register />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/company" element={<RegisterCompany />} />

            {/* Company */}
          <Route path="/company/doggos" element={<CompanyDoggos/>} />
          <Route path="/company/home" element={<CompanyHome/>} />
          <Route path="/company/calendar" element={<CompanyCalendar/>} />
          <Route path="/company/statistics" element={<CompanyStatistics/>} />
          <Route path="/company/messages" element={<CompanyMessages/>} />
          <Route path="/company/aa" element={<CompanyHome/>} />
          <Route path="/company/cambiar" element={<DashboardCompany/>} />
          <Route path="/company/doggoform" element={<DashboardCompany/>} />
          <Route path="/company/adddoggo" element={<Adddoggo/>} />

            {/* User */}
          <Route path="/dashboard/user" element={<User />} />
          <Route path="/cuestionario" element={<Questionnaire />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;