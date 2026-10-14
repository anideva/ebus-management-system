import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";
import { API_BASE_URL } from "../config/api";

function TicketManagement() {

  // ===========================
  // STATES
  // ===========================

  const [userEmail, setUserEmail] = useState("Admin");

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

  const [tickets, setTickets] = useState([]);
  const [buses, setBuses] = useState([]);

  // ===========================
  // FETCH TICKETS & BUSES
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

        const [ticketsRes, busesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tickets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/buses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setTickets(ticketsData);
        }

        if (busesRes.ok) {
          const busesData = await busesRes.json();
          setBuses(busesData);
        }
      } catch (error) {
        console.error("Error fetching tickets or buses:", error);
      }
    });

    return () => unsubscribe();
  }, []);


  // ===========================
  // GENERATE SEATS
  // ===========================

  const generateSeats = (capacity) => {

    const seats = [];

    for (let i = 0; i < capacity; i++) {

      const row = String.fromCharCode(
        65 + Math.floor(i / 4)
      );

      const seat = (i % 4) + 1;

      seats.push(`${row}${seat}`);

    }

    return seats;
  };


  // ===========================
  // CHECK SEAT AVAILABILITY
  // ===========================

  const isSeatBooked = (seat) => {

    return tickets.some(
      (ticket) =>
        ticket.busNumber === newTicket.busNumber &&
        ticket.journeyDate === newTicket.journeyDate &&
        ticket.seatNumber === seat &&
        ticket.status === "Booked"
    );

  };


  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {

    const { name, value } = e.target;


    if (name === "busNumber") {

      const selectedBus = buses.find(
        (bus) => bus.busNumber === value
      );


      setNewTicket({
        ...newTicket,
        busNumber: value,
        routeName: selectedBus
          ? (selectedBus.route || selectedBus.routeName || "")
          : "",
        fare: selectedBus && selectedBus.fare
          ? selectedBus.fare
          : newTicket.fare,
      });

      return;
    }


    setNewTicket({
      ...newTicket,
      [name]: value,
    });

  };


  // ===========================
  // ADD TICKET
  // ===========================

  const handleAddTicket = async () => {

    // Check duplicate Ticket ID

    const ticketExists = tickets.some(
      (ticket) =>
        ticket.ticketId === newTicket.ticketId
    );


    // Check whether selected seat
    // is already booked

    const seatAlreadyBooked = tickets.some(
      (ticket) =>
        ticket.busNumber === newTicket.busNumber &&
        ticket.journeyDate === newTicket.journeyDate &&
        ticket.seatNumber === newTicket.seatNumber &&
        ticket.status === "Booked"
    );


    // Validate required fields

    if (
      !newTicket.ticketId.trim() ||
      !newTicket.passengerName.trim() ||
      !newTicket.busNumber ||
      !newTicket.routeName ||
      !newTicket.journeyDate ||
      !newTicket.seatNumber ||
      !newTicket.fare
    ) {

      alert("Please fill in all the fields.");

      return;

    }


    if (ticketExists) {

      alert("Ticket ID already exists!");

      return;

    }


    if (seatAlreadyBooked) {

      alert(
        "This seat is already booked for this bus and journey date."
      );

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
        `${API_BASE_URL}/api/tickets`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newTicket),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to create ticket"
        );

      }


      // Add new ticket to frontend list

      setTickets([
        ...tickets,
        data,
      ]);


      // Reset form

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


      alert("Ticket booked successfully!");

    } catch (error) {

      console.error(
        "Error creating ticket:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // DELETE TICKET
  // ===========================

  const handleDeleteTicket = async (ticketId) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${ticketId}?`
    );


    if (!confirmed) {
      return;
    }


    const ticketToDelete = tickets.find(
      (ticket) =>
        ticket.ticketId === ticketId
    );


    if (!ticketToDelete) {

      alert("Ticket not found.");

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
        `${API_BASE_URL}/api/tickets/${ticketToDelete._id}`,
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
          "Failed to delete ticket"
        );

      }


      // Remove deleted ticket
      // from frontend list

      setTickets(
        tickets.filter(
          (ticket) =>
            ticket._id !== ticketToDelete._id
        )
      );


      alert(
        `Ticket ID ${ticketId} deleted successfully.`
      );

    } catch (error) {

      console.error(
        "Error deleting ticket:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // EDIT TICKET
  // ===========================

  const handleEditTicket = (ticket) => {

    setNewTicket({
      ticketId: ticket.ticketId,
      passengerName: ticket.passengerName,
      busNumber: ticket.busNumber,
      routeName: ticket.routeName,
      journeyDate: ticket.journeyDate,
      seatNumber: ticket.seatNumber,
      fare: ticket.fare,
      status: ticket.status,
    });


    setEditingTicket(ticket);

  };


  // ===========================
  // UPDATE TICKET
  // ===========================

  const handleUpdateTicket = async () => {

    // Prevent duplicate Ticket ID

    const duplicateTicket = tickets.some(
      (ticket) =>
        ticket.ticketId === newTicket.ticketId &&
        ticket._id !== editingTicket._id
    );


    if (duplicateTicket) {

      alert("Ticket ID already exists!");

      return;

    }


    // Check whether selected seat
    // is already booked

    const seatExists = tickets.some(
      (ticket) =>
        ticket._id !== editingTicket._id &&
        ticket.busNumber === newTicket.busNumber &&
        ticket.journeyDate === newTicket.journeyDate &&
        ticket.seatNumber === newTicket.seatNumber &&
        ticket.status === "Booked"
    );


    if (seatExists) {

      alert(
        "This seat is already booked for the selected bus and date!"
      );

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
        `${API_BASE_URL}/api/tickets/${editingTicket._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(newTicket),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to update ticket"
        );

      }


      // Replace old ticket
      // with updated ticket

      setTickets(
        tickets.map((ticket) =>
          ticket._id === editingTicket._id
            ? data
            : ticket
        )
      );


      // Exit edit mode

      setEditingTicket(null);


      // Reset form

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


      alert("Ticket updated successfully!");

    } catch (error) {

      console.error(
        "Error updating ticket:",
        error
      );

      alert(error.message);

    }

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


  // ===========================
  // JSX
  // ===========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail={userEmail} />

        <h1>🎟️ Ticket Management</h1>

        <p>
          Manage all bus tickets from this page.
        </p>


        {/* ===========================
            TICKET FORM
        =========================== */}

        <div className="add-bus-form">

          <h2>
            {editingTicket
              ? "Edit Ticket"
              : "Add New Ticket"}
          </h2>


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


            <select
              name="busNumber"
              value={newTicket.busNumber}
              onChange={handleChange}
            >

              <option value="">
                Select Bus
              </option>


              {buses.map((bus) => (

                <option
                  key={bus.busNumber}
                  value={bus.busNumber}
                >
                  {bus.busNumber}
                </option>

              ))}

            </select>


            <input
              type="text"
              name="routeName"
              placeholder="Route Name"
              value={newTicket.routeName}
              readOnly
            />


            <input
              type="date"
              name="journeyDate"
              value={newTicket.journeyDate}
              onChange={handleChange}
            />


            <select
              name="seatNumber"
              value={newTicket.seatNumber}
              onChange={handleChange}
              disabled={
                !newTicket.busNumber ||
                !newTicket.journeyDate
              }
            >

              <option value="">
                Select Seat
              </option>


              {newTicket.busNumber &&
                newTicket.journeyDate &&
                generateSeats(
                  buses.find(
                    (bus) =>
                      bus.busNumber ===
                      newTicket.busNumber
                  )?.capacity || 0
                ).map((seat) => (

                  <option
                    key={seat}
                    value={seat}
                    disabled={isSeatBooked(seat)}
                  >
                    {isSeatBooked(seat)
                      ? `${seat} - Booked`
                      : seat}
                  </option>

                ))}

            </select>


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


          {/* ===========================
              ADD / UPDATE BUTTONS
          =========================== */}

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


        {/* ===========================
            TICKET TABLE
        =========================== */}

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

                <td>
                  {ticket.ticketId}
                </td>

                <td>
                  {ticket.passengerName}
                </td>

                <td>
                  {ticket.busNumber}
                </td>

                <td>
                  {ticket.routeName}
                </td>

                <td>
                  {ticket.journeyDate}
                </td>

                <td>
                  {ticket.seatNumber}
                </td>

                <td>
                  {ticket.fare}
                </td>

                <td>
                  {ticket.status}
                </td>

                <td>

                  {/* EDIT TICKET BUTTON */}

                  <button
                    onClick={() =>
                      handleEditTicket(ticket)
                    }
                  >
                    Edit
                  </button>


                  {/* DELETE TICKET BUTTON */}

                  <button
                    onClick={() =>
                      handleDeleteTicket(
                        ticket.ticketId
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

  );
}

export default TicketManagement;