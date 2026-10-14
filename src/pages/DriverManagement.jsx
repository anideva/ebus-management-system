import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";
import { API_BASE_URL } from "../config/api";

function DriverManagement() {

  // ===========================
  // STATES
  // ===========================

  const [userEmail, setUserEmail] = useState("Admin");

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


  // ===========================
  // FETCH DRIVER DATA
  // ===========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
      }

      if (user.email) {
        setUserEmail(user.email);
      }

      try {
        const token = await user.getIdToken();

        const response = await fetch(
          `${API_BASE_URL}/api/drivers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            data.message ||
            "Failed to fetch drivers"
          );
        }

        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    });

    return () => unsubscribe();
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

    // Validate required fields

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


    // Check duplicate Driver ID

    const driverExists = drivers.some(
      (driver) =>
        driver.driverId === newDriver.driverId
    );

    if (driverExists) {

      alert("Driver ID already exists!");

      return;

    }


    try {

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token
      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/drivers`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
          data.error ||
          data.message ||
          "Failed to create driver"
        );

      }


      // Add the database response
      // to the frontend

      setDrivers([
        ...drivers,
        data,
      ]);


      // Reset form

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

      console.error(
        "Error creating driver:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // DELETE DRIVER
  // ===========================

  const handleDeleteDriver = async (driverId) => {

    const driver = drivers.find(
      (driver) =>
        driver.driverId === driverId
    );


    if (!driver) {

      alert("Driver not found.");

      return;

    }


    const confirmed = window.confirm(
      `Are you sure you want to delete Driver ID ${driverId}?`
    );


    if (!confirmed) {
      return;
    }


    try {

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token
      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/drivers/${driver._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to delete driver"
        );

      }


      // Remove driver from frontend

      setDrivers(
        drivers.filter(
          (item) =>
            item._id !== driver._id
        )
      );


      alert(
        `Driver ID ${driverId} deleted successfully.`
      );

    } catch (error) {

      console.error(
        "Error deleting driver:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // EDIT DRIVER
  // ===========================

  const handleEditDriver = (driver) => {

    setNewDriver({
      driverId: driver.driverId || "",
      driverName: driver.driverName || "",
      contactNumber:
        driver.contactNumber || "",
      experience:
        driver.experience || "",
      licenseNumber:
        driver.licenseNumber || "",
      assignedBus:
        driver.assignedBus || "",
      busType:
        driver.busType || "",
      capacity:
        driver.capacity ?? "",
      status:
        driver.status || "Active",
    });

    setEditingDriver(driver);

  };


  // ===========================
  // UPDATE DRIVER
  // ===========================

  const handleUpdateDriver = async () => {

    // Check duplicate Driver ID

    const duplicateDriver = drivers.some(
      (driver) =>
        driver.driverId ===
          newDriver.driverId &&
        driver._id !== editingDriver._id
    );


    if (duplicateDriver) {

      alert("Driver ID already exists!");

      return;

    }


    try {

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token
      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/drivers/${editingDriver._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
          data.error ||
          data.message ||
          "Failed to update driver"
        );

      }


      // Update frontend with
      // the database response

      setDrivers(
        drivers.map((driver) =>
          driver._id === editingDriver._id
            ? data
            : driver
        )
      );


      // Exit edit mode

      setEditingDriver(null);


      // Reset form

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

      console.error(
        "Error updating driver:",
        error
      );

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


  // ===========================
  // DRIVER MANAGEMENT UI
  // ===========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail={userEmail} />

        <h1>👨‍✈️ Driver Management</h1>

        <p>
          Manage all drivers from this page.
        </p>


        {/* ===========================
            DRIVER FORM
        =========================== */}

        <div className="add-bus-form">

          <h2>
            {editingDriver
              ? "Edit Driver"
              : "Add New Driver"}
          </h2>


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


          {/* ===========================
              ADD / UPDATE BUTTONS
          =========================== */}

          <div className="button-group">

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


        {/* ===========================
            DRIVER TABLE
        =========================== */}

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

                <td>
                  {driver.driverId}
                </td>

                <td>
                  {driver.driverName}
                </td>

                <td>
                  {driver.contactNumber}
                </td>

                <td>
                  {driver.experience}
                </td>

                <td>
                  {driver.licenseNumber}
                </td>

                <td>
                  {driver.assignedBus}
                </td>

                <td>
                  {driver.busType}
                </td>

                <td>
                  {driver.capacity}
                </td>

                <td>
                  {driver.status}
                </td>

                <td>

                  {/* EDIT DRIVER BUTTON */}

                  <button
                    onClick={() =>
                      handleEditDriver(driver)
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE DRIVER BUTTON */}

                  <button
                    onClick={() =>
                      handleDeleteDriver(
                        driver.driverId
                      )
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