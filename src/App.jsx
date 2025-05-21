import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
// Pages
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Company from "./pages/empresa/DashboardCompany";
import User from "./pages/usuario/DashboardUser";
import Questionnaire from "./pages/cuestionario/Questionnaire";
import RegisterUser from './pages/RegisterUser';
import RegisterCompany from './pages/RegisterCompany';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/company" element={<Company />} />
          <Route path="/dashboard/user" element={<User />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/company" element={<RegisterCompany />} />
          <Route path="/cuestionario" element={<Questionnaire />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;