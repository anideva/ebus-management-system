import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function TicketManagement() {

  // ===========================
  // STATES
  // ===========================

  const [newTicket, setNewTicket] = useState({
    ticketId: "",
    passengerName: "",
    busNumber: "",
    routeName: "",
    journeyDate: "",
    seatNumber: "",
    fare: "",
    status: "Booked",
  });

  const [editingTicket, setEditingTicket] = useState(null);

  const [tickets, setTickets] = useState([
    {
      id: 1,
      ticketId: "T001",
      passengerName: "Rahul Sharma",
      busNumber: "AS01AB1234",
      routeName: "Guwahati - Tezpur",
      journeyDate: "2026-08-12",
      seatNumber: "A1",
      fare: "350",
      status: "Booked",
    },
    {
      id: 2,
      ticketId: "T002",
      passengerName: "Priya Das",
      busNumber: "AS02CD5678",
      routeName: "Guwahati - Nagaon",
      journeyDate: "2026-08-13",
      seatNumber: "B5",
      fare: "250",
      status: "Booked",
    },
    {
      id: 3,
      ticketId: "T003",
      passengerName: "Arjun Bora",
      busNumber: "AS03EF9012",
      routeName: "Guwahati - Shillong",
      journeyDate: "2026-08-15",
      seatNumber: "C3",
      fare: "450",
      status: "Cancelled",
    },
  ]);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {
    setNewTicket({
      ...newTicket,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // ADD TICKET
  // ===========================

  const handleAddTicket = () => {

    if (
      !newTicket.ticketId.trim() ||
      !newTicket.passengerName.trim() ||
      !newTicket.busNumber.trim() ||
      !newTicket.routeName.trim() ||
      !newTicket.journeyDate ||
      !newTicket.seatNumber.trim() ||
      !newTicket.fare.trim()
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    const ticketExists = tickets.some(
      (ticket) => ticket.ticketId === newTicket.ticketId
    );

    if (ticketExists) {
      alert("Ticket ID already exists!");
      return;
    }

    setTickets([
      ...tickets,
      newTicket,
    ]);

    setNewTicket({
      ticketId: "",
      passengerName: "",
      busNumber: "",
      routeName: "",
      journeyDate: "",
      seatNumber: "",
      fare: "",
      status: "Booked",
    });

    setEditingTicket(null);
  };

  // ===========================
  // DELETE TICKET
  // ===========================

  const handleDeleteTicket = (ticketId) => {

    const filteredTickets = tickets.filter(
      (ticket) => ticket.ticketId !== ticketId
    );

    setTickets(filteredTickets);

    alert(`Ticket ID ${ticketId} deleted successfully.`);
  };

  // ===========================
  // EDIT TICKET
  // ===========================

  const handleEditTicket = (ticket) => {

    setNewTicket(ticket);

    setEditingTicket(ticket);

  };

  // ===========================
  // UPDATE TICKET
  // ===========================

  const handleUpdateTicket = () => {

    const duplicateTicket = tickets.some(
      (ticket) =>
        ticket.ticketId === newTicket.ticketId &&
        ticket.ticketId !== editingTicket.ticketId
    );

    if (duplicateTicket) {
      alert("Ticket ID already exists!");
      return;
    }

    const updatedTickets = tickets.map((ticket) => {

      if (ticket.ticketId === editingTicket.ticketId) {
        return {
          ...ticket,
          ...newTicket,
        };
      }

      return ticket;

    });

    setTickets(updatedTickets);

    setEditingTicket(null);

    setNewTicket({
      ticketId: "",
      passengerName: "",
      busNumber: "",
      routeName: "",
      journeyDate: "",
      seatNumber: "",
      fare: "",
      status: "Booked",
    });

  };

  // ===========================
  // HANDLE CANCEL
  // ===========================

  const handleCancel = () => {

    setEditingTicket(null);

    setNewTicket({
      ticketId: "",
      passengerName: "",
      busNumber: "",
      routeName: "",
      journeyDate: "",
      seatNumber: "",
      fare: "",
      status: "Booked",
    });

  };

    return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>🎟️ Ticket Management</h1>

        <p>
          Manage all bus tickets from this page.
        </p>

        <div className="add-bus-form">

          <h2>Add New Ticket</h2>

          <div className="form-grid">

            <input
              type="text"
              name="ticketId"
              placeholder="Ticket ID"
              value={newTicket.ticketId}
              onChange={handleChange}
            />

            <input
              type="text"
              name="passengerName"
              placeholder="Passenger Name"
              value={newTicket.passengerName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="busNumber"
              placeholder="Bus Number"
              value={newTicket.busNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="routeName"
              placeholder="Route Name"
              value={newTicket.routeName}
              onChange={handleChange}
            />

            <input
              type="date"
              name="journeyDate"
              value={newTicket.journeyDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="seatNumber"
              placeholder="Seat Number"
              value={newTicket.seatNumber}
              onChange={handleChange}
            />

            <input
              type="number"
              name="fare"
              placeholder="Fare"
              value={newTicket.fare}
              onChange={handleChange}
            />

            <select
              name="status"
              value={newTicket.status}
              onChange={handleChange}
            >
              <option>Booked</option>
              <option>Cancelled</option>
            </select>

          </div>

          <div className="button-group">

            <button
              className="add-bus-btn"
              onClick={
                editingTicket
                  ? handleUpdateTicket
                  : handleAddTicket
              }
            >
              {editingTicket
                ? "Update Ticket"
                : "Add Ticket"}
            </button>

            {editingTicket && (
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
              <th>Ticket ID</th>
              <th>Passenger Name</th>
              <th>Bus Number</th>
              <th>Route</th>
              <th>Journey Date</th>
              <th>Seat Number</th>
              <th>Fare (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.ticketId}>

                <td>{ticket.ticketId}</td>

                <td>{ticket.passengerName}</td>

                <td>{ticket.busNumber}</td>

                <td>{ticket.routeName}</td>

                <td>{ticket.journeyDate}</td>

                <td>{ticket.seatNumber}</td>

                <td>{ticket.fare}</td>

                <td>{ticket.status}</td>

                <td>

                  <button
                    onClick={() => handleEditTicket(ticket)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTicket(ticket.ticketId)
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

export default TicketManagement;