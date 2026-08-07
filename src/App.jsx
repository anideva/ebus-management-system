import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusManagement from "./pages/BusManagement";
import RouteManagement from "./pages/RouteManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buses" element={<BusManagement />} />
        <Route path="/routes" element={<RouteManagement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;