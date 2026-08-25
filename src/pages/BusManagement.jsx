import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";


function BusManagement() {

//STATES
 // STATES

const [newBus, setNewBus] = useState({
  busNumber: "",
  busName: "",
  busType: "",
  driver: "",
  route: "",
  capacity: "",
  fare: "",
  status: "Active",
});

const [editingBus, setEditingBus] = useState(null);

const [buses, setBuses] = useState([]);

 useEffect(() => {
  const fetchBuses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/buses");

      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }

      const data = await response.json();

      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  fetchBuses();
}, []);
//FUNCTIONS
//HANDLING THE CHANGE 
const handleChange = (e) => {
  //Reset the form after succesfully adding a bus
  setNewBus({
    ...newBus,
    [e.target.name]: e.target.value,
  });
};
/// PREVENT DUBLICATE BUS NUMBERS while adding the bus.
const handleAddBus = async () => {
  if (
    !newBus.busNumber.trim() ||
    !newBus.busName.trim() ||
    !newBus.busType.trim() ||
    !newBus.driver.trim() ||
    !newBus.route.trim() ||
    !newBus.capacity ||
    !newBus.fare
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/buses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBus),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create bus");
    }

    setBuses([...buses, data]);

    setNewBus({
      busNumber: "",
      busName: "",
      busType: "",
      driver: "",
      route: "",
      capacity: "",
      fare: "",
      status: "Active",
    });

    alert("Bus added successfully!");
  } catch (error) {
    console.error("Error adding bus:", error);
    alert(error.message);
  }
};
//handle delete bus button
//Create a new array excluding the selected bus
const handleDeleteBus = async (id, busNumber) => {
  const confirmed = window.confirm(
  `Are you sure you want to delete bus ${busNumber}?`
);

if (!confirmed) {
  return;
}
  try {
    const response = await fetch(
      `http://localhost:5000/api/buses/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete bus");
    }

    setBuses(
      buses.filter((bus) => bus._id !== id)
    );

    alert(`Bus number ${busNumber} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting bus:", error);
    alert(error.message);
  }
};
//handle the editing of bus details
const handleEditBus = (bus) => {
  console.log(bus);
  setNewBus(bus);
  setEditingBus(bus);
};

//Update the selected bus and refresh the bus list
const handleUpdateBus =() => {
  const updatedBuses = buses.map((bus)=> {
if (bus.busNumber === editingBus.busNumber){
  return newBus;
}
return bus;
  });
  setBuses(updatedBuses)
  setEditingBus(null);

  setNewBus({
  busNumber: "",
  busName: "",
  driver: "",
  route: "",
  capacity: "",
  status: "Active",
  });
};

const handleCancel = () => {

  setEditingBus(null);

  setNewBus({
    busNumber: "",
    busName: "",
    driver: "",
    route: "",
    capacity: "",
    status: "Active",
  });

};

//JSX 
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar userEmail="Admin" />

        <h1>🚌 Bus Management</h1>

        <p>
          Manage all buses from this page.
        </p>
        <div className="add-bus-form">
  <h2>Add New Bus</h2>

  <div className="form-grid">
    <input 
    type="text" 
    name="busNumber" 
    placeholder="Bus Number" 
    value={newBus.busNumber}
  onChange={handleChange}
/>

    <input
  type="text"
  name="busName"
  placeholder="Bus Name"
  value={newBus.busName}
  onChange={handleChange}
/>

 <input
    type="text"
    name="busType"
    placeholder="Bus Type"
    value={newBus.busType}
    onChange={handleChange}
  />

  <input
    type="number"
    name="fare"
    placeholder="Fare"
    value={newBus.fare}
    onChange={handleChange}
    />
    <input
  type="text"
  name="driver"
  placeholder="Driver Name"
  value={newBus.driver}
  onChange={handleChange}
/>

    <input
  type="text"
  name="route"
  placeholder="Route"
  value={newBus.route}
  onChange={handleChange}
/>

    <input
  type="number"
  name="capacity"
  placeholder="Capacity"
  value={newBus.capacity}
  onChange={handleChange}
/>

    <select
      name= "status"
      value={newBus.status}
      onChange={handleChange}
      >

      <option>Active</option>
      <option>Maintenance</option>
    </select>
  </div>

 <div className="button-group">

  <button
    className="add-bus-btn"
    onClick={
      editingBus
        ? handleUpdateBus
        : handleAddBus
    }
  >
    {editingBus ? "Update Bus" : "Add Bus"}
  </button>

  {editingBus && (
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
      <th>Bus Number</th>
      <th>Bus Name</th>
      <th>Driver</th>
      <th>Route</th>
      <th>Capacity</th>
      <th>Status</th>
      <th>Action</th>
      </tr>
  </thead>

  <tbody>
    {buses.map((bus) => (
      <tr key={bus.busNumber}>
        <td>{bus.busNumber}</td>
        <td>{bus.busName}</td>
        <td>{bus.driver}</td>
        <td>{bus.route}</td>
        <td>{bus.capacity}</td>
        <td>{bus.status}</td>
        <td>
          <button onClick={()=> handleEditBus(bus)}>
            Edit

          </button>
        </td>
        <td>
          <button onClick={() => handleDeleteBus(bus._id, bus.busNumber)}>
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

export default BusManagement;