import {useState} from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";


function RouteManagement() {

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
  //update the route from state
  setNewRoute({
    ...newRoute,
    [e.target.name]: e.target.value,
  });
};
/// PREVENT DUBLICATE 
const handleAddRoute = () => {
   const routeExists = routes.some(
    (route) => route.routeId === newRoute.routeId

  );
  if (
  !newRoute.routeId.trim() ||
  !newRoute.routeName.trim() ||
  !newRoute.source.trim() ||
  !newRoute.destination.trim() ||
  !newRoute.stops.trim() ||
  !newRoute.distance.trim() ||
  !newRoute.estimatedTime.trim()
) {
  alert("Please fill in all the fields.");
  return;
}

  if (routeExists) {
    alert("Route ID already exists!");
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

//Create a new array excluding the selected route
const handleDeleteRoute = (routeId) => {
  const filteredRoutes = routes.filter(
    (route) => route.routeId !== routeId
  );

  setRoutes(filteredRoutes);

  alert(`Route ID ${routeId} deleted successfully.`);
};
//handle the editing of route details
const handleEditRoute = (route) => {
  console.log(route);
  setNewRoute(route);
  setEditingRoute(route);
};

const handleUpdateRoute = () => {

  const duplicateRoute = routes.some(
    (route) =>
      route.routeId === newRoute.routeId &&
      route.routeId !== editingRoute.routeId
  );

  if (duplicateRoute) {
    alert("Route ID already exists!");
    return;
  }

  const updatedRoutes = routes.map((route) => {

    if (route.routeId === editingRoute.routeId) {
      return {
        ...route,
        ...newRoute,
      };
    }

    return route;

  });

  setRoutes(updatedRoutes);

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

// ===========================
// HANDLE CANCEL
// ===========================

const handleCancel = () => {

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
          Manage all routes from this page.
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
  name="routeName"
  placeholder="Route Name"
  value={newRoute.routeName}
  onChange={handleChange}
/>
   <input
  type="text"
  name="destination"
  placeholder="Route Destination"
  value={newRoute.destination}
  onChange={handleChange}
/>

   <input
  type="text"
  name="stops"
  placeholder="Route stops"
  value={newRoute.stops}
  onChange={handleChange}
/>
    <input
  type="text"
  name="distance"
  placeholder="Route Distance"
  value={newRoute.distance}
  onChange={handleChange}
/>

 <input
  type="text"
  name="estimatedTime"
  placeholder="Route Time"
  value={newRoute.estimatedTime}
  onChange={handleChange}
/>

<input
  type="text"
  name="source"
  placeholder="Source"
  value={newRoute.source}
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

 <div className="button-group">

  <button
    className="add-bus-btn"
    onClick={
      editingRoute
        ? handleUpdateRoute
        : handleAddRoute
    }
  >
    {editingRoute ? "Update Route" : "Add Route"}
  </button>

  {editingRoute && (
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
      <th>Route ID</th>
<th>Route Name</th>
<th>Source</th>
<th>Destination</th>
<th>Stops</th>
<th>Distance</th>
<th>Estimated Time</th>
<th>Status</th>
<th>Action</th>
      </tr>
  </thead>

  <tbody>
    {routes.map((route) => (
      <tr key={route.routeId}>
        <td>{route.routeId}</td>
        <td>{route.routeName}</td>
        <td>{route.source}</td>
        <td>{route.destination}</td>
        <td>{route.stops}</td>
        <td>{route.distance}</td>
        <td>{route.estimatedTime}</td>
        <td>{route.status}</td>
        <td>
  <button onClick={() => handleEditRoute(route)}>
    Edit
  </button>

  <button onClick={() => handleDeleteRoute(route.routeId)}>
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

export default RouteManagement;