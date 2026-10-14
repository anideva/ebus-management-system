import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";
import { API_BASE_URL } from "../config/api";

function RouteManagement() {

  // ===========================
  // STATES
  // ===========================

  const [userEmail, setUserEmail] = useState("Admin");

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

  const [editingRoute, setEditingRoute] = useState(null);

  const [routes, setRoutes] = useState([]);


  // ===========================
  // FETCH ROUTES
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
          `${API_BASE_URL}/api/routes`,
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
            "Failed to fetch routes"
          );
        }

        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    });

    return () => unsubscribe();
  }, []);


  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {

    setNewRoute({
      ...newRoute,
      [e.target.name]: e.target.value,
    });

  };


  // ===========================
  // ADD ROUTE
  // ===========================

  const handleAddRoute = async () => {

    // Validate required fields

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


    // Prevent duplicate Route ID

    const routeExists = routes.some(
      (route) =>
        route.routeId === newRoute.routeId
    );

    if (routeExists) {

      alert("Route ID already exists!");

      return;

    }


    try {

      // Check Firebase login

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token

      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/routes`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...newRoute,

            // Convert comma-separated stops
            // into an array

            stops: newRoute.stops
              .split(",")
              .map((stop) => stop.trim()),

            // Convert strings into numbers

            distance: Number(newRoute.distance),

            estimatedTime:
              Number(newRoute.estimatedTime),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to create route"
        );

      }


      // Add newly created route
      // to the frontend list

      setRoutes([
        ...routes,
        data,
      ]);


      // Reset form

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

      console.error(
        "Error adding route:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // DELETE ROUTE
  // ===========================

  const handleDeleteRoute = async (id, routeId) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete route ${routeId}?`
    );


    if (!confirmed) {
      return;
    }


    try {

      // Check Firebase login

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token

      const token = await user.getIdToken();


      const response = await fetch(
        `${API_BASE_URL}/api/routes/${id}`,
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
          "Failed to delete route"
        );

      }


      // Remove deleted route
      // from frontend

      setRoutes(
        routes.filter(
          (route) =>
            route._id !== id
        )
      );


      alert(
        `Route ID ${routeId} deleted successfully.`
      );

    } catch (error) {

      console.error(
        "Error deleting route:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // EDIT ROUTE
  // ===========================

  const handleEditRoute = (route) => {

    setNewRoute({
      ...route,

      // Convert stops array
      // back into a string for the input

      stops: route.stops.join(", "),
    });

    setEditingRoute(route);

  };


  // ===========================
  // UPDATE ROUTE
  // ===========================

  const handleUpdateRoute = async () => {

    // Prevent duplicate Route ID

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

      // Check Firebase login

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token

      const token = await user.getIdToken();


      const response = await fetch(
        `${API_BASE_URL}/api/routes/${editingRoute._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            ...newRoute,

            // Convert stops string
            // back into an array

            stops: newRoute.stops
              .split(",")
              .map((stop) => stop.trim()),

            // Convert numeric fields

            distance:
              Number(newRoute.distance),

            estimatedTime:
              Number(newRoute.estimatedTime),

          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to update route"
        );

      }


      // Replace old route
      // with updated route

      setRoutes(
        routes.map((route) =>
          route._id === editingRoute._id
            ? data
            : route
        )
      );


      // Exit edit mode

      setEditingRoute(null);


      // Reset form

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

      console.error(
        "Error updating route:",
        error
      );

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


  // ===========================
  // ROUTE MANAGEMENT UI
  // ===========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail={userEmail} />

        <h1>🛣️ Route Management</h1>

        <p>
          Manage all routes from this page.
        </p>


        {/* ===========================
            ROUTE FORM
        =========================== */}

        <div className="add-bus-form">

          <h2>
            {editingRoute
              ? "Edit Route"
              : "Add New Route"}
          </h2>


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
              placeholder="Route stops (comma separated)"
              value={newRoute.stops}
              onChange={handleChange}
            />


            <input
              type="number"
              name="distance"
              placeholder="Route Distance"
              value={newRoute.distance}
              onChange={handleChange}
            />


            <input
              type="number"
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
              name="status"
              value={newRoute.status}
              onChange={handleChange}
            >

              <option>Active</option>
              <option>Inactive</option>

            </select>

          </div>


          {/* ===========================
              ADD / UPDATE BUTTONS
          =========================== */}

          <div className="button-group">

            <button
              className="add-bus-btn"
              onClick={
                editingRoute
                  ? handleUpdateRoute
                  : handleAddRoute
              }
            >

              {editingRoute
                ? "Update Route"
                : "Add Route"}

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


        {/* ===========================
            ROUTE TABLE
        =========================== */}

        <div className="table-responsive">
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

                <td>
                  {route.routeId}
                </td>

                <td>
                  {route.routeName}
                </td>

                <td>
                  {route.source}
                </td>

                <td>
                  {route.destination}
                </td>

                <td>
                  {route.stops.join(", ")}
                </td>

                <td>
                  {route.distance}
                </td>

                <td>
                  {route.estimatedTime}
                </td>

                <td>
                  {route.status}
                </td>

                <td>

                  {/* EDIT ROUTE BUTTON */}

                  <button
                    onClick={() =>
                      handleEditRoute(route)
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE ROUTE BUTTON */}

                  <button
                    style={{ color: "var(--danger)", borderColor: "var(--danger)", background: "transparent", marginLeft: "6px" }}
                    onClick={() =>
                      handleDeleteRoute(
                        route._id,
                        route.routeId
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

    </div>

  );

}

export default RouteManagement;