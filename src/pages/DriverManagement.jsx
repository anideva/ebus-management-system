import { useState, useEffect } from "react";
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

  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
  const fetchDrivers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/drivers"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to fetch drivers"
        );
      }

      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  fetchDrivers();
}, []);

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

  const handleAddDriver = async () => {
  if (
    !newDriver.driverId.trim() ||
    !newDriver.driverName.trim() ||
    !newDriver.contactNumber.trim() ||
    !newDriver.experience.trim() ||
    !newDriver.licenseNumber.trim() ||
    !newDriver.assignedBus.trim() ||
    !newDriver.busType.trim() ||
    !newDriver.capacity
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  const driverExists = drivers.some(
    (driver) => driver.driverId === newDriver.driverId
  );

  if (driverExists) {
    alert("Driver ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/drivers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newDriver,
          capacity: Number(newDriver.capacity),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to create driver"
      );
    }

    setDrivers([...drivers, data]);

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

    alert("Driver added successfully!");
  } catch (error) {
    console.error("Error creating driver:", error);
    alert(error.message);
  }
};
  // ===========================
  // DELETE DRIVER
  // ===========================

  const handleDeleteDriver = async (driverId) => {
  const driver = drivers.find(
    (driver) => driver.driverId === driverId
  );

  if (!driver) {
    alert("Driver not found.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/drivers/${driver._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to delete driver"
      );
    }

    setDrivers(
      drivers.filter((item) => item._id !== driver._id)
    );

    alert(`Driver ID ${driverId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting driver:", error);
    alert(error.message);
  }
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
const handleUpdateDriver = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/drivers/${editingDriver._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newDriver,
          capacity: Number(newDriver.capacity),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to update driver"
      );
    }

    setDrivers(
      drivers.map((driver) =>
        driver._id === editingDriver._id ? data : driver
      )
    );

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

    alert("Driver updated successfully!");
  } catch (error) {
    console.error("Error updating driver:", error);
    alert(error.message);
  }
};
  // ===========================
  // HANDLE CANCEL
  // ===========================

const handleCancel = () => {

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

         <div className="button-group">

  <button
    className="add-bus-btn"
    onClick={
      editingDriver
        ? handleUpdateDriver
        : handleAddDriver
    }
  >
    {editingDriver ? "Update Driver" : "Add Driver"}
  </button>

  {editingDriver && (
    <button
      className="add-bus-btn cancel-btn"
      onClick={handleCancel}
    >
      Cancel
    </button>
  )}

</div>
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