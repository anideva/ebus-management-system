import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function StudentManagement() {

  // ===========================
  // STATES
  // ===========================

  const [newStudent, setNewStudent] = useState({
    studentId: "",
    studentName: "",
    studentClass: "",
    section: "",
    contactNumber: "",
    assignedRoute: "",
    assignedBus: "",
    status: "Active",
  });

  const [editingStudent, setEditingStudent] = useState(null);

  const [students, setStudents] = useState([]);

  useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to fetch students"
        );
      }

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);
  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // ADD STUDENT
  // ===========================
const handleAddStudent = async () => {
  if (
    !newStudent.studentId.trim() ||
    !newStudent.studentName.trim() ||
    !newStudent.studentClass.trim() ||
    !newStudent.section.trim() ||
    !newStudent.contactNumber.trim() ||
    !newStudent.assignedRoute.trim() ||
    !newStudent.assignedBus.trim()
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  const studentExists = students.some(
    (student) => student.studentId === newStudent.studentId
  );

  if (studentExists) {
    alert("Student ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/students",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to create student"
      );
    }

    setStudents([...students, data]);

    setNewStudent({
      studentId: "",
      studentName: "",
      studentClass: "",
      section: "",
      contactNumber: "",
      assignedRoute: "",
      assignedBus: "",
      status: "Active",
    });

    setEditingStudent(null);

    alert("Student added successfully!");
  } catch (error) {
    console.error("Error creating student:", error);
    alert(error.message);
  }
};

  // ===========================
  // DELETE STUDENT
  // ===========================

  const handleDeleteStudent = async (studentId) => {
  const student = students.find(
    (student) => student.studentId === studentId
  );

  if (!student) {
    alert("Student not found.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${student._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to delete student"
      );
    }

    setStudents(
      students.filter((item) => item._id !== student._id)
    );

    alert(`Student ID ${studentId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting student:", error);
    alert(error.message);
  }
};

  // ===========================
  // EDIT STUDENT
  // ===========================

  const handleEditStudent = (student) => {

    setNewStudent(student);

    setEditingStudent(student);

  };

  // ===========================
  // UPDATE STUDENT
  // ===========================

 const handleUpdateStudent = async () => {
  const duplicateStudent = students.some(
    (student) =>
      student.studentId === newStudent.studentId &&
      student._id !== editingStudent._id
  );

  if (duplicateStudent) {
    alert("Student ID already exists!");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${editingStudent._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Failed to update student"
      );
    }

    setStudents(
      students.map((student) =>
        student._id === editingStudent._id ? data : student
      )
    );

    setEditingStudent(null);

    setNewStudent({
      studentId: "",
      studentName: "",
      studentClass: "",
      section: "",
      contactNumber: "",
      assignedRoute: "",
      assignedBus: "",
      status: "Active",
    });

    alert("Student updated successfully!");
  } catch (error) {
    console.error("Error updating student:", error);
    alert(error.message);
  }
};

  // ===========================
  // HANDLE CANCEL
  // ===========================

  const handleCancel = () => {

    setEditingStudent(null);

    setNewStudent({
      studentId: "",
      studentName: "",
      studentClass: "",
      section: "",
      contactNumber: "",
      assignedRoute: "",
      assignedBus: "",
      status: "Active",
    });

  };
    return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>🎓 Student Management</h1>

        <p>
          Manage all students from this page.
        </p>

        <div className="add-bus-form">

          <h2>Add New Student</h2>

          <div className="form-grid">

            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={newStudent.studentId}
              onChange={handleChange}
            />

            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={newStudent.studentName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="studentClass"
              placeholder="Class"
              value={newStudent.studentClass}
              onChange={handleChange}
            />

            <input
              type="text"
              name="section"
              placeholder="Section"
              value={newStudent.section}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={newStudent.contactNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="assignedRoute"
              placeholder="Assigned Route"
              value={newStudent.assignedRoute}
              onChange={handleChange}
            />

            <input
              type="text"
              name="assignedBus"
              placeholder="Assigned Bus"
              value={newStudent.assignedBus}
              onChange={handleChange}
            />

            <select
              name="status"
              value={newStudent.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

          </div>

          <div className="button-group">

            <button
              className="add-bus-btn"
              onClick={
                editingStudent
                  ? handleUpdateStudent
                  : handleAddStudent
              }
            >
              {editingStudent
                ? "Update Student"
                : "Add Student"}
            </button>

            {editingStudent && (
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
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Contact</th>
              <th>Assigned Route</th>
              <th>Assigned Bus</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr key={student.studentId}>

                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.studentClass}</td>
                <td>{student.section}</td>
                <td>{student.contactNumber}</td>
                <td>{student.assignedRoute}</td>
                <td>{student.assignedBus}</td>
                <td>{student.status}</td>

                <td>

                  <button
                    onClick={() => handleEditStudent(student)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteStudent(student.studentId)
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

export default StudentManagement;