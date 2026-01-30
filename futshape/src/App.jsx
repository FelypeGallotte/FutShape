import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from './pages/Login';
import Home from "./pages/Home";
import Musculacao from "./pages/Musculacao";
import Alimentacao from "./pages/Alimentacao";
import Treino from "./pages/Treino";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} /> 
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/musculacao" element={<Musculacao />} />
        <Route path="/alimentacao" element={<Alimentacao />} />
        <Route path="/treino" element={<Treino />} />
      </Routes>
    </BrowserRouter>
  );
}
