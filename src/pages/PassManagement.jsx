import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function PassManagement() {

  // ===========================
  // STATES
  // ===========================

  const [newPass, setNewPass] = useState({
    passId: "",
    studentName: "",
    studentId: "",
    busNumber: "",
    routeName: "",
    validFrom: "",
    validUntil: "",
    passType: "Monthly",
    status: "Active",
  });

  const [editingPass, setEditingPass] = useState(null);

  const [passes, setPasses] = useState([
    {
      id: 1,
      passId: "P001",
      studentName: "Rohan Das",
      studentId: "ST001",
      busNumber: "AS01AB1234",
      routeName: "Guwahati - Tezpur",
      validFrom: "2026-08-01",
      validUntil: "2026-08-31",
      passType: "Monthly",
      status: "Active",
    },
    {
      id: 2,
      passId: "P002",
      studentName: "Priya Sharma",
      studentId: "ST002",
      busNumber: "AS02CD5678",
      routeName: "Guwahati - Nagaon",
      validFrom: "2026-08-01",
      validUntil: "2026-10-31",
      passType: "Quarterly",
      status: "Active",
    },
    {
      id: 3,
      passId: "P003",
      studentName: "Arjun Bora",
      studentId: "ST003",
      busNumber: "AS03EF9012",
      routeName: "Guwahati - Shillong",
      validFrom: "2026-07-01",
      validUntil: "2026-07-31",
      passType: "Monthly",
      status: "Expired",
    },
  ]);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {
    setNewPass({
      ...newPass,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // ADD PASS
  // ===========================

  const handleAddPass = () => {

    const passExists = passes.some(
      (pass) => pass.passId === newPass.passId
    );
    if (
  !newPass.passId.trim() ||
  !newPass.studentName.trim() ||
  !newPass.studentId.trim() ||
  !newPass.busNumber.trim() ||
  !newPass.routeName.trim() ||
  !newPass.validFrom ||
  !newPass.validUntil
) {
  alert("Please fill in all the fields.");
  return;
}

    if (passExists) {
      alert("Pass ID already exists!");
      return;
    }

    setPasses([
      ...passes,
      newPass,
    ]);

    setNewPass({
      passId: "",
      studentName: "",
      studentId: "",
      busNumber: "",
      routeName: "",
      validFrom: "",
      validUntil: "",
      passType: "Monthly",
      status: "Active",
    });

    setEditingPass(null);
  };

  // ===========================
  // DELETE PASS
  // ===========================

  const handleDeletePass = (passId) => {

    const filteredPasses = passes.filter(
      (pass) => pass.passId !== passId
    );

    setPasses(filteredPasses);

    alert(`Pass ID ${passId} deleted successfully.`);
  };

  // ===========================
  // EDIT PASS
  // ===========================

  const handleEditPass = (pass) => {
    console.log("Editing:", pass);

    setNewPass(pass);

    setEditingPass(pass);

  };

  // ===========================
  // UPDATE PASS
  // ===========================

const handleUpdatePass = () => {

  const duplicatePass = passes.some(
    (pass) =>
      pass.passId === newPass.passId &&
      pass.passId !== editingPass.passId
  );

  if (duplicatePass) {
    alert("Pass ID already exists!");
    return;
  }

  const updatedPasses = passes.map((pass) => {
    if (pass.passId === editingPass.passId) {
      return {
        ...pass,
        ...newPass,
      };
    }

    return pass;
  });

  setPasses(updatedPasses);

  setEditingPass(null);

  setNewPass({
    passId: "",
    studentName: "",
    studentId: "",
    busNumber: "",
    routeName: "",
    validFrom: "",
    validUntil: "",
    passType: "Monthly",
    status: "Active",
  });
};

// ===========================
// HANDLE CANCEL
// ===========================

const handleCancel = () => {
  setEditingPass(null);

  setNewPass({
    passId: "",
    studentName: "",
    studentId: "",
    busNumber: "",
    routeName: "",
    validFrom: "",
    validUntil: "",
    passType: "Monthly",
    status: "Active",
  });
};

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>🎫 Pass Management</h1>

        <p>
          Manage all student bus passes from this page.
        </p>

        <div className="add-bus-form">

          <h2>Add New Pass</h2>

          <div className="form-grid">

            <input
              type="text"
              name="passId"
              placeholder="Pass ID"
              value={newPass.passId}
              onChange={handleChange}
            />

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={newPass.studentName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={newPass.studentId}
              onChange={handleChange}
            />

            <input
              type="text"
              name="busNumber"
              placeholder="Bus Number"
              value={newPass.busNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="routeName"
              placeholder="Route Name"
              value={newPass.routeName}
              onChange={handleChange}
            />

            <input
              type="date"
              name="validFrom"
              value={newPass.validFrom}
              onChange={handleChange}
            />
                        <input
              type="date"
              name="validUntil"
              value={newPass.validUntil}
              onChange={handleChange}
            />

            <select
              name="passType"
              value={newPass.passType}
              onChange={handleChange}
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>

            <select
              name="status"
              value={newPass.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Expired</option>
            </select>

          </div>

         <div className="button-group">

  <button
    className="add-bus-btn"
    onClick={
      editingPass
        ? handleUpdatePass
        : handleAddPass
    }
  >
    {editingPass ? "Update Pass" : "Add Pass"}
  </button>

  {editingPass && (
    <button
      className="add-bus-btn cancel-btn"
      onClick={handleCancel}
    >
      Cancel
    </button>
  )}

</div>
        </div>
        <h3>
  {editingPass ? "Editing Mode" : "Adding Mode"}
</h3>

        <table className="bus-table">

          <thead>

            <tr>
              <th>Pass ID</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Bus Number</th>
              <th>Route</th>
              <th>Valid From</th>
              <th>Valid Until</th>
              <th>Pass Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {passes.map((pass) => (

              <tr key={pass.passId}>

                <td>{pass.passId}</td>

                <td>{pass.studentName}</td>

                <td>{pass.studentId}</td>

                <td>{pass.busNumber}</td>

                <td>{pass.routeName}</td>

                <td>{pass.validFrom}</td>

                <td>{pass.validUntil}</td>

                <td>{pass.passType}</td>

                <td>{pass.status}</td>

                <td>

                  <button
                    onClick={() => handleEditPass(pass)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeletePass(pass.passId)
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

export default PassManagement;