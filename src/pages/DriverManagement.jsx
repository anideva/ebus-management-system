import {useState} from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";


function DriverManagement() {

//STATES
  const [newRoute, setNewRoute] = useState({
  routeId: "",
  routeName: "",
  source: "",
  destination: "",
  stops: "",
  distance: "",
  estimatedTime: "",
  status: "Active",
});

 const [editingRoute, setEditingRoute]= useState(null);
 

    const [routes, setRoutes] =useState ([
 {
  id: 1,
  routeId: "R001",
  routeName: "Guwahati - Tezpur",
  source: "Guwahati",
  destination: "Tezpur",
  stops: "Jagiroad, Raha, Nagaon, Kaliabor",
  distance: "185 km",
  estimatedTime: "4 Hours",
  status: "Active",
},
{ 
id: 2,
routeId: "R002",
routeName: "Guwahati - Nagaon",
source: "Guwahati",
destination: "Nagaon",
stops: "Jagiroad, Raha",
distance: "125 km",
estimatedTime: "3 Hours",
status: "Active",
},
{
  id: 3,
routeId: "R003",
routeName: "Guwahati - Shillong",
source: "Guwahati",
destination: "Shillong",
stops: "Jorabat, Nongpoh",
distance: "100 km",
estimatedTime: "3 Hours",
status: "Active"
},
]);
//FUNCTIONS
//HANDLING THE CHANGE 
const handleChange = (e) => {
  //Reset the form after succesfully adding a bus
  setNewRoute({
    ...newRoute,
    [e.target.name]: e.target.value,
  });
};
/// PREVENT DUBLICATE BUS NUMBERS while adding the bus.
const handleAddRoute = () => {
   const busExists = routes.some(
    (bus) => bus.busNumber === newRoute.busNumber
  );

  if (busExists) {
    alert("Bus number already exists!");
    return;
  }
setRoutes([
  ...routes,
  newRoute,
  
]);
setNewRoute({
  routeId: "",
  routeName: "",
  source: "",
  destination: "",
  stops: "",
  distance: "",
  estimatedTime: "",
  status: "Active",
});
};
//handle delete bus button
//Create a new array excluding the selected bus
const handleDeleteRoute = (busNumber) => {
  const filteredRoutes = routes.filter(
    (bus) => bus.busNumber !== busNumber
  );

  setRoutes(filteredRoutes);

  alert(`Bus number ${busNumber} deleted successfully.`);
};
//handle the editing of bus details
const handleEditRoute = (bus) => {
  console.log(bus);
  setNewRoute(bus);
  setEditingRoute(bus);
};

//Update the selected bus and refresh the bus list
const handleUpdateRoute =() => {
  const updatedRoutes = routes.map((bus)=> {
if (bus.busNumber === editingRoute.busNumber){
  return newRoute;
}
return bus;
  });
  setRoutes(updatedRoutes)
  setEditingRoute(null);

 setNewRoute({
  routeId: "",
  routeName: "",
  source: "",
  destination: "",
  stops: "",
  distance: "",
  estimatedTime: "",
  status: "Active",
});
};


//JSX 
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar userEmail="Admin" />

        <h1>🛣️ Route Management</h1>

        <p>
          Manage all buses from this page.
        </p>
        <div className="add-bus-form">
  <h2>Add New Route</h2>

  <div className="form-grid">
   <input
  type="text"
  name="routeId"
  placeholder="Route ID"
  value={newRoute.routeId}
  onChange={handleChange}
/>

   <input
  type="text"
  name="routeId"
  placeholder="Route ID"
  value={newRoute.routeId}
  onChange={handleChange}
/>
   <input
  type="text"
  name="routeId"
  placeholder="Route ID"
  value={newRoute.routeId}
  onChange={handleChange}
/>

   <input
  type="text"
  name="routeId"
  placeholder="Route ID"
  value={newRoute.routeId}
  onChange={handleChange}
/>
    <input
  type="text"
  name="routeId"
  placeholder="Route ID"
  value={newRoute.routeId}
  onChange={handleChange}
/>

    <select
      name= "status"
      value={newRoute.status}
      onChange={handleChange}
      >

      <option>Active</option>
      <option>Maintenance</option>
    </select>
  </div>

  <button
   className="add-bus-btn"
   onClick={editingRoute ? handleUpdateRoute: handleAddRoute}
   >
   {editingRoute ? "Update Route": "Add Route"}
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
      <th>Action</th>
      </tr>
  </thead>

  <tbody>
    {routes.map((route) => (
      <tr key={route.busNumber}>
        <td>{route.busNumber}</td>
        <td>{route.busName}</td>
        <td>{route.driver}</td>
        <td>{route.route}</td>
        <td>{route.capacity}</td>
        <td>{route.status}</td>
        <td>
          <button onClick={()=> handleEditRoute(route)}>
            Edit

          </button>
        </td>
        <td>
          <button onClick={()=> handleDeleteRoute(route.busNumber)}>
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