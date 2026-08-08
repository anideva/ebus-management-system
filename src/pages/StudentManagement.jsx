import { useState } from "react";
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

  const [students, setStudents] = useState([
    {
      id: 1,
      studentId: "ST001",
      studentName: "Rahul Sharma",
      studentClass: "10",
      section: "A",
      contactNumber: "9876543210",
      assignedRoute: "Guwahati - Tezpur",
      assignedBus: "AS01AB1234",
      status: "Active",
    },
    {
      id: 2,
      studentId: "ST002",
      studentName: "Priya Das",
      studentClass: "9",
      section: "B",
      contactNumber: "9123456780",
      assignedRoute: "Guwahati - Nagaon",
      assignedBus: "AS02CD5678",
      status: "Active",
    },
    {
      id: 3,
      studentId: "ST003",
      studentName: "Arjun Bora",
      studentClass: "8",
      section: "C",
      contactNumber: "9988776655",
      assignedRoute: "Guwahati - Shillong",
      assignedBus: "AS03EF9012",
      status: "Inactive",
    },
  ]);

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

  const handleAddStudent = () => {

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

    setStudents([
      ...students,
      newStudent,
    ]);

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
  };

  // ===========================
  // DELETE STUDENT
  // ===========================

  const handleDeleteStudent = (studentId) => {

    const filteredStudents = students.filter(
      (student) => student.studentId !== studentId
    );

    setStudents(filteredStudents);

    alert(`Student ID ${studentId} deleted successfully.`);
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

  const handleUpdateStudent = () => {

    const duplicateStudent = students.some(
      (student) =>
        student.studentId === newStudent.studentId &&
        student.studentId !== editingStudent.studentId
    );

    if (duplicateStudent) {
      alert("Student ID already exists!");
      return;
    }

    const updatedStudents = students.map((student) => {

      if (student.studentId === editingStudent.studentId) {
        return {
          ...student,
          ...newStudent,
        };
      }

      return student;

    });

    setStudents(updatedStudents);

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