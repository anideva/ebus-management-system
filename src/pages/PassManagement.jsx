import { useState,useEffect} from "react";
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

  const [passes, setPasses] = useState([]);
  useEffect(() => {
  const fetchPasses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/passes"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to fetch passes"
        );
      }

     setPasses(
  data.map((pass) => ({
    ...pass,
    validFrom: pass.validFrom
      ? pass.validFrom.split("T")[0]
      : "",
    validUntil: pass.validUntil
      ? pass.validUntil.split("T")[0]
      : "",
  }))
);
    } catch (error) {
      console.error("Error fetching passes:", error);
    }
  };

  fetchPasses();
}, []);

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

const handleAddPass = async () => {
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

  const passExists = passes.some(
    (pass) => pass.passId === newPass.passId
  );

  if (passExists) {
    alert("Pass ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/passes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPass),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to create pass"
      );
    }

    setPasses([...passes, data]);

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

    alert("Pass added successfully!");
  } catch (error) {
    console.error("Error creating pass:", error);
    alert(error.message);
  }
};

  // ===========================
  // DELETE PASS
  // ===========================

  const handleDeletePass = async (passId) => {
  const passToDelete = passes.find(
    (pass) => pass.passId === passId
  );

  if (!passToDelete) {
    alert("Pass not found.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/passes/${passToDelete._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to delete pass"
      );
    }

    const filteredPasses = passes.filter(
      (pass) => pass._id !== passToDelete._id
    );

    setPasses(filteredPasses);

    alert(`Pass ID ${passId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting pass:", error);
    alert(error.message);
  }
};
  

// ===========================
// EDIT PASS
// ===========================

const handleEditPass = (pass) => {
  setNewPass(pass);
  setEditingPass(pass);
};

  // ===========================
  // UPDATE PASS
  // ===========================

const handleUpdatePass = async () => {
  const duplicatePass = passes.some(
    (pass) =>
      pass.passId === newPass.passId &&
      pass._id !== editingPass._id
  );

  if (duplicatePass) {
    alert("Pass ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/passes/${editingPass._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPass),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to update pass"
      );
    }

    const updatedPasses = passes.map((pass) =>
      pass._id === editingPass._id ? data : pass
    );

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

    alert("Pass updated successfully!");
  } catch (error) {
    console.error("Error updating pass:", error);
    alert(error.message);
  }
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

            <div className="date-field">
  <label>Valid From</label>

  <input
    type="date"
    name="validFrom"
    value={newPass.validFrom}
    onChange={handleChange}
  />
</div>

<div className="date-field">
  <label>Valid Until</label>

  <input
    type="date"
    name="validUntil"
    value={newPass.validUntil}
    onChange={handleChange}
  />
</div>
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

                <td>
  {pass.validFrom
    ? new Date(pass.validFrom).toLocaleDateString("en-IN")
    : ""}
</td>

<td>
  {pass.validUntil
    ? new Date(pass.validUntil).toLocaleDateString("en-IN")
    : ""}
</td>

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