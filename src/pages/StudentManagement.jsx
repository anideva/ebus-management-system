import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";
import { API_BASE_URL } from "../config/api";

function StudentManagement() {

  // ===========================
  // STATES
  // ===========================

  const [userEmail, setUserEmail] = useState("Admin");

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


  // ===========================
  // FETCH STUDENTS
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
          `${API_BASE_URL}/api/students`,
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
            "Failed to fetch students"
          );
        }

        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    });

    return () => unsubscribe();
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

    // Validate required fields

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


    // Prevent duplicate Student ID

    const studentExists = students.some(
      (student) =>
        student.studentId === newStudent.studentId
    );

    if (studentExists) {

      alert("Student ID already exists!");

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
        `${API_BASE_URL}/api/students`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newStudent),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to create student"
        );

      }


      // Add newly created student
      // to frontend list

      setStudents([
        ...students,
        data,
      ]);


      // Reset form

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

      console.error(
        "Error creating student:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // DELETE STUDENT
  // ===========================

  const handleDeleteStudent = async (studentId) => {

    const student = students.find(
      (student) =>
        student.studentId === studentId
    );


    if (!student) {

      alert("Student not found.");

      return;

    }


    // Ask for confirmation before deleting

    const confirmed = window.confirm(
      `Are you sure you want to delete Student ID ${studentId}?`
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
        `${API_BASE_URL}/api/students/${student._id}`,
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
          "Failed to delete student"
        );

      }


      // Remove deleted student
      // from frontend list

      setStudents(
        students.filter(
          (item) =>
            item._id !== student._id
        )
      );


      alert(
        `Student ID ${studentId} deleted successfully.`
      );

    } catch (error) {

      console.error(
        "Error deleting student:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // EDIT STUDENT
  // ===========================

  const handleEditStudent = (student) => {

    setNewStudent({
      studentId: student.studentId || "",
      studentName: student.studentName || "",
      studentClass: student.studentClass || "",
      section: student.section || "",
      contactNumber: student.contactNumber || "",
      assignedRoute: student.assignedRoute || "",
      assignedBus: student.assignedBus || "",
      status: student.status || "Active",
    });

    setEditingStudent(student);

  };


  // ===========================
  // UPDATE STUDENT
  // ===========================

  const handleUpdateStudent = async () => {

    // Prevent duplicate Student ID

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

      // Check Firebase login

      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in");
      }

      // Get Firebase ID token

      const token = await user.getIdToken();

      const response = await fetch(
        `${API_BASE_URL}/api/students/${editingStudent._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newStudent),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to update student"
        );

      }


      // Replace old student
      // with updated student

      setStudents(
        students.map((student) =>
          student._id === editingStudent._id
            ? data
            : student
        )
      );


      // Exit edit mode

      setEditingStudent(null);


      // Reset form

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

      console.error(
        "Error updating student:",
        error
      );

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


  // ===========================
  // STUDENT MANAGEMENT UI
  // ===========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail={userEmail} />

        <h1>🎓 Student Management</h1>

        <p>
          Manage all students from this page.
        </p>


        {/* ===========================
            STUDENT FORM
        =========================== */}

        <div className="add-bus-form">

          <h2>
            {editingStudent
              ? "Edit Student"
              : "Add New Student"}
          </h2>


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


          {/* ===========================
              ADD / UPDATE BUTTONS
          =========================== */}

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


        {/* ===========================
            STUDENT TABLE
        =========================== */}

        <div className="table-responsive">
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

                <td>
                  {student.studentId}
                </td>

                <td>
                  {student.studentName}
                </td>

                <td>
                  {student.studentClass}
                </td>

                <td>
                  {student.section}
                </td>

                <td>
                  {student.contactNumber}
                </td>

                <td>
                  {student.assignedRoute}
                </td>

                <td>
                  {student.assignedBus}
                </td>

                <td>
                  {student.status}
                </td>


                <td>

                  {/* EDIT STUDENT BUTTON */}

                  <button
                    onClick={() =>
                      handleEditStudent(student)
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE STUDENT BUTTON */}

                  <button
                    style={{ color: "var(--danger)", borderColor: "var(--danger)", background: "transparent", marginLeft: "6px" }}
                    onClick={() =>
                      handleDeleteStudent(
                        student.studentId
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

export default StudentManagement;