import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusManagement from "./pages/BusManagement";
import RouteManagement from "./pages/RouteManagement";
import DriverManagement from "./pages/DriverManagement";
import PassManagement from "./pages/PassManagement";
import StudentManagement from "./pages/StudentManagement";
import TicketManagement from "./pages/TicketManagement";
import PaymentManagement from "./pages/PaymentManagement";

// Passenger Portal Pages & Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import BookTicket from "./pages/passenger/BookTicket";
import MyBookings from "./pages/passenger/MyBookings";
import MyPasses from "./pages/passenger/MyPasses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Administrator Management Routes (Role: admin) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buses"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BusManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/routes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RouteManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DriverManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TicketManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PaymentManagement />
            </ProtectedRoute>
          }
        />

        {/* Passenger Portal Routes (Role: passenger or admin) */}
        <Route
          path="/passenger"
          element={<Navigate to="/passenger/book" replace />}
        />
        <Route
          path="/passenger/book"
          element={
            <ProtectedRoute allowedRoles={["passenger", "admin"]}>
              <BookTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/bookings"
          element={
            <ProtectedRoute allowedRoles={["passenger", "admin"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/passes"
          element={
            <ProtectedRoute allowedRoles={["passenger", "admin"]}>
              <MyPasses />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;