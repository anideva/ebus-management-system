import {useState} from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";


function BusManagement() {


  const [newBus, setNewBus] = useState({
  busNumber: "",
  busName: "",
  driver: "",
  route: "",
  capacity: "",
  status: "Active",
});

    const [buses, setBuses] =useState ([
  {
    id: 1,
    busNumber: "AS01AB1234",
    busName: "Assam Express",
    driver: "Rahul Sharma",
    route: "Guwahati → Tezpur",
    capacity: 45,
    status: "Active",
  },
  {
    id: 2,
    busNumber: "AS02CD5678",
    busName: "City Rider",
    driver: "Amit Das",
    route: "Guwahati → Nagaon",
    capacity: 40,
    status: "Maintenance",
  },
  {
    id: 3,
    busNumber: "AS03EF9012",
    busName: "Hill Traveler",
    driver: "Sanjay Bora",
    route: "Guwahati → Shillong",
    capacity: 50,
    status: "Active",
  },
]);
const handleChange = (e) => {
  setNewBus({
    ...newBus,
    [e.target.name]: e.target.value,
  });
};

const handleAddBus = () => {
   const busExists = buses.some(
    (bus) => bus.busNumber === newBus.busNumber
  );

  if (busExists) {
    alert("Bus number already exists!");
    return;
  }
setBuses([
  ...buses,
  newBus,
]);
};
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

  <button
   className="add-bus-btn"
   onClick={handleAddBus}
   >
    Add Bus
  </button>
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
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
}

export default BusManagement;