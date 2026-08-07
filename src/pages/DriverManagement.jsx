import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function DriverManagement() {

  // ===========================
  // STATES
  // ===========================

  const [newDriver, setNewDriver] = useState({
    driverId: "",
    driverName: "",
    contactNumber: "",
    experience: "",
    licenseNumber: "",
    assignedBus: "",
    busType: "",
    capacity: "",
    status: "Active",
  });

  const [editingDriver, setEditingDriver] = useState(null);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      driverId: "D001",
      driverName: "Rahul Sharma",
      contactNumber: "9876543210",
      experience: "5 Years",
      licenseNumber: "DL-AS-12345",
      assignedBus: "AS01AB1234",
      busType: "AC Sleeper",
      capacity: "45",
      status: "Active",
    },
    {
      id: 2,
      driverId: "D002",
      driverName: "Amit Das",
      contactNumber: "9123456780",
      experience: "3 Years",
      licenseNumber: "DL-AS-54321",
      assignedBus: "AS02CD5678",
      busType: "Non AC",
      capacity: "40",
      status: "Active",
    },
    {
      id: 3,
      driverId: "D003",
      driverName: "Sanjay Bora",
      contactNumber: "9988776655",
      experience: "8 Years",
      licenseNumber: "DL-AS-67890",
      assignedBus: "AS03EF9012",
      busType: "Volvo",
      capacity: "50",
      status: "On Leave",
    },
  ]);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {
    setNewDriver({
      ...newDriver,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // ADD DRIVER
  // ===========================

  const handleAddDriver = () => {

    const driverExists = drivers.some(
      (driver) => driver.driverId === newDriver.driverId
    );

    if (driverExists) {
      alert("Driver ID already exists!");
      return;
    }

    setDrivers([
      ...drivers,
      newDriver,
    ]);

    setNewDriver({
      driverId: "",
      driverName: "",
      contactNumber: "",
      experience: "",
      licenseNumber: "",
      assignedBus: "",
      busType: "",
      capacity: "",
      status: "Active",
    });

    setEditingDriver(null);
  };

  // ===========================
  // DELETE DRIVER
  // ===========================

  const handleDeleteDriver = (driverId) => {

    const filteredDrivers = drivers.filter(
      (driver) => driver.driverId !== driverId
    );

    setDrivers(filteredDrivers);

    alert(`Driver ID ${driverId} deleted successfully.`);
  };

  // ===========================
  // EDIT DRIVER
  // ===========================

  const handleEditDriver = (driver) => {

    setNewDriver(driver);

    setEditingDriver(driver);

  };

  // ===========================
  // UPDATE DRIVER
  // ===========================

  const handleUpdateDriver = () => {

    const updatedDrivers = drivers.map((driver) => {

      if (driver.driverId === editingDriver.driverId) {

        return newDriver;

      }

      return driver;

    });

    setDrivers(updatedDrivers);

    setEditingDriver(null);

    setNewDriver({
      driverId: "",
      driverName: "",
      contactNumber: "",
      experience: "",
      licenseNumber: "",
      assignedBus: "",
      busType: "",
      capacity: "",
      status: "Active",
    });

  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>👨‍✈️ Driver Management</h1>

        <p>
          Manage all drivers from this page.
        </p>

        <div className="add-bus-form">

          <h2>Add New Driver</h2>

          <div className="form-grid">

            <input
              type="text"
              name="driverId"
              placeholder="Driver ID"
              value={newDriver.driverId}
              onChange={handleChange}
            />

            <input
              type="text"
              name="driverName"
              placeholder="Driver Name"
              value={newDriver.driverName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={newDriver.contactNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={newDriver.experience}
              onChange={handleChange}
            />

            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={newDriver.licenseNumber}
              onChange={handleChange}
            />
                        <input
              type="text"
              name="assignedBus"
              placeholder="Assigned Bus"
              value={newDriver.assignedBus}
              onChange={handleChange}
            />

            <input
              type="text"
              name="busType"
              placeholder="Bus Type"
              value={newDriver.busType}
              onChange={handleChange}
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newDriver.capacity}
              onChange={handleChange}
            />

            <select
              name="status"
              value={newDriver.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>On Leave</option>
            </select>

          </div>

          <button
            className="add-bus-btn"
            onClick={
              editingDriver
                ? handleUpdateDriver
                : handleAddDriver
            }
          >
            {editingDriver
              ? "Update Driver"
              : "Add Driver"}
          </button>

        </div>

        <table className="bus-table">

          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Contact</th>
              <th>Experience</th>
              <th>License No.</th>
              <th>Assigned Bus</th>
              <th>Bus Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {drivers.map((driver) => (

              <tr key={driver.driverId}>

                <td>{driver.driverId}</td>

                <td>{driver.driverName}</td>

                <td>{driver.contactNumber}</td>

                <td>{driver.experience}</td>

                <td>{driver.licenseNumber}</td>

                <td>{driver.assignedBus}</td>

                <td>{driver.busType}</td>

                <td>{driver.capacity}</td>

                <td>{driver.status}</td>

                <td>

                  <button
                    onClick={() => handleEditDriver(driver)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteDriver(driver.driverId)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DriverManagement;