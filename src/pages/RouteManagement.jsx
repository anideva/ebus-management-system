import {useState, useEffect} from "react";
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
 

    const [routes, setRoutes] =useState ([]);
    useEffect(() => {
  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/routes");

      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }

      const data = await response.json();

      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  fetchRoutes();
}, []);
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
const handleAddRoute = async () => {
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

  const routeExists = routes.some(
    (route) => route.routeId === newRoute.routeId
  );

  if (routeExists) {
    alert("Route ID already exists!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newRoute,
        stops: newRoute.stops
          .split(",")
          .map((stop) => stop.trim()),
        distance: Number(newRoute.distance),
        estimatedTime: Number(newRoute.estimatedTime),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create route");
    }

    setRoutes([...routes, data]);

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

    alert("Route added successfully!");
  } catch (error) {
    console.error("Error adding route:", error);
    alert(error.message);
  }
};

//Create a new array excluding the selected route
const handleDeleteRoute = async (id, routeId) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete route ${routeId}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/routes/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete route");
    }

    setRoutes(
      routes.filter((route) => route._id !== id)
    );

    alert(`Route ID ${routeId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting route:", error);
    alert(error.message);
  }
};
//handle the editing of route details
const handleEditRoute = (route) => {
  console.log(route);

  setNewRoute({
    ...route,
    stops: route.stops.join(", "),
  });

  setEditingRoute(route);
};

const handleUpdateRoute = async () => {
  const duplicateRoute = routes.some(
    (route) =>
      route.routeId === newRoute.routeId &&
      route._id !== editingRoute._id
  );

  if (duplicateRoute) {
    alert("Route ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/routes/${editingRoute._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRoute,
          stops: newRoute.stops
            .split(",")
            .map((stop) => stop.trim()),
          distance: Number(newRoute.distance),
          estimatedTime: Number(newRoute.estimatedTime),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update route");
    }

    setRoutes(
      routes.map((route) =>
        route._id === editingRoute._id ? data : route
      )
    );

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

    alert("Route updated successfully!");
  } catch (error) {
    console.error("Error updating route:", error);
    alert(error.message);
  }
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
        <td>{route.stops.join(", ")}</td>
        <td>{route.distance}</td>
        <td>{route.estimatedTime}</td>
        <td>{route.status}</td>
        <td>
  <button onClick={() => handleEditRoute(route)}>
    Edit
  </button>

  <button
  onClick={() => handleDeleteRoute(route._id, route.routeId)}
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

export default RouteManagement;