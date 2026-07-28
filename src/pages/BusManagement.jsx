import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function BusManagement() {
    const buses = [
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
];
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar userEmail="Admin" />

        <h1>🚌 Bus Management</h1>

        <p>
          Manage all buses from this page.
        </p>
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
      <tr key={bus.id}>
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