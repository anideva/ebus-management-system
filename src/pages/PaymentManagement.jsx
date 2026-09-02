import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/busManagement.css";

function PaymentManagement() {

  // ===========================
  // STATES
  // ===========================

  const [newPayment, setNewPayment] = useState({
    paymentId: "",
    ticketId: "",
    passengerName: "",
    amount: "",
    paymentMethod: "UPI",
    transactionId: "",
    status: "Paid",
  });

  const [tickets] = useState([
    {
      ticketId: "T001",
      passengerName: "Rahul Sharma",
      amount: "350",
    },
    {
      ticketId: "T002",
      passengerName: "Priya Das",
      amount: "250",
    },
    {
      ticketId: "T003",
      passengerName: "Arjun Bora",
      amount: "450",
    },
    {
      ticketId: "T004",
      passengerName: "Neha Sharma",
      amount: "300",
    },
  ]);

  const [editingPayment, setEditingPayment] = useState(null);

  const [payments, setPayments] = useState([]);


  // ===========================
  // FETCH PAYMENTS
  // ===========================

  useEffect(() => {

    const fetchPayments = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/payments"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            data.message ||
            "Failed to fetch payments"
          );
        }

        setPayments(data);

      } catch (error) {

        console.error(
          "Error fetching payments:",
          error
        );

      }

    };

    fetchPayments();

  }, []);


  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    // When ticket is selected,
    // automatically fill passenger and amount

    if (name === "ticketId") {

      const selectedTicket = tickets.find(
        (ticket) =>
          ticket.ticketId === value
      );

      setNewPayment({
        ...newPayment,
        ticketId: value,
        passengerName: selectedTicket
          ? selectedTicket.passengerName
          : "",
        amount: selectedTicket
          ? selectedTicket.amount
          : "",
      });

      return;
    }

    setNewPayment({
      ...newPayment,
      [name]: value,
    });

  };


  // ===========================
  // ADD PAYMENT
  // ===========================

  const handleAddPayment = async () => {

    // Validate required fields

    if (
      !newPayment.paymentId.trim() ||
      !newPayment.ticketId.trim() ||
      !newPayment.passengerName.trim() ||
      !newPayment.amount ||
      !newPayment.transactionId.trim()
    ) {

      alert("Please fill in all the fields.");

      return;

    }


    // Check duplicate Payment ID

    const paymentExists = payments.some(
      (payment) =>
        payment.paymentId ===
        newPayment.paymentId
    );

    if (paymentExists) {

      alert("Payment ID already exists!");

      return;

    }


    // Check duplicate Transaction ID

    const transactionExists = payments.some(
      (payment) =>
        payment.transactionId ===
        newPayment.transactionId
    );

    if (transactionExists) {

      alert("Transaction ID already exists!");

      return;

    }


    try {

      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...newPayment,
            amount: Number(newPayment.amount),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to create payment"
        );

      }


      // Add the database response
      // to the frontend

      setPayments([
        ...payments,
        data,
      ]);


      // Reset form

      setNewPayment({
        paymentId: "",
        ticketId: "",
        passengerName: "",
        amount: "",
        paymentMethod: "UPI",
        transactionId: "",
        status: "Paid",
      });


      alert("Payment added successfully!");

    } catch (error) {

      console.error(
        "Error adding payment:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // EDIT PAYMENT
  // ===========================

  const handleEditPayment = (payment) => {

    setNewPayment({
      paymentId: payment.paymentId || "",
      ticketId: payment.ticketId || "",
      passengerName:
        payment.passengerName || "",
      amount: payment.amount ?? "",
      paymentMethod:
        payment.paymentMethod || "UPI",
      transactionId:
        payment.transactionId || "",
      status:
        payment.status || "Paid",
    });

    setEditingPayment(payment);

  };


  // ===========================
  // UPDATE PAYMENT
  // ===========================

  const handleUpdatePayment = async () => {

    // Check duplicate Payment ID

    const duplicatePayment = payments.some(
      (payment) =>
        payment.paymentId ===
          newPayment.paymentId &&
        payment._id !== editingPayment._id
    );

    if (duplicatePayment) {

      alert("Payment ID already exists!");

      return;

    }


    // Check duplicate Transaction ID

    const duplicateTransaction = payments.some(
      (payment) =>
        payment.transactionId ===
          newPayment.transactionId &&
        payment._id !== editingPayment._id
    );

    if (duplicateTransaction) {

      alert("Transaction ID already exists!");

      return;

    }


    try {

      const response = await fetch(
        `http://localhost:5000/api/payments/${editingPayment._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...newPayment,
            amount: Number(newPayment.amount),
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to update payment"
        );

      }


      // Update frontend with
      // the database response

      const updatedPayments = payments.map(
        (payment) =>
          payment._id === editingPayment._id
            ? data
            : payment
      );


      setPayments(updatedPayments);


      // Exit edit mode

      setEditingPayment(null);


      // Reset form

      setNewPayment({
        paymentId: "",
        ticketId: "",
        passengerName: "",
        amount: "",
        paymentMethod: "UPI",
        transactionId: "",
        status: "Paid",
      });


      alert("Payment updated successfully!");

    } catch (error) {

      console.error(
        "Error updating payment:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // DELETE PAYMENT
  // ===========================

  const handleDeletePayment = async (payment) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Payment ID ${payment.paymentId}?`
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:5000/api/payments/${payment._id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          data.message ||
          "Failed to delete payment"
        );

      }


      // Remove from frontend

      const filteredPayments =
        payments.filter(
          (item) =>
            item._id !== payment._id
        );


      setPayments(filteredPayments);


      alert(
        `Payment ID ${payment.paymentId} deleted successfully.`
      );

    } catch (error) {

      console.error(
        "Error deleting payment:",
        error
      );

      alert(error.message);

    }

  };


  // ===========================
  // HANDLE CANCEL
  // ===========================

  const handleCancel = () => {

    setEditingPayment(null);

    setNewPayment({
      paymentId: "",
      ticketId: "",
      passengerName: "",
      amount: "",
      paymentMethod: "UPI",
      transactionId: "",
      status: "Paid",
    });

  };


  // ===========================
  // RETURN UI
  // ===========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>💳 Payment Management</h1>

        <p>
          Manage all ticket payments from this page.
        </p>


        {/* ===========================
            PAYMENT FORM
        =========================== */}

        <div className="add-bus-form">

          <h2>
            {editingPayment
              ? "Edit Payment"
              : "Add New Payment"}
          </h2>


          <div className="form-grid">

            {/* Payment ID */}

            <input
              type="text"
              name="paymentId"
              placeholder="Payment ID"
              value={newPayment.paymentId}
              onChange={handleChange}
            />


            {/* Ticket */}

            <select
              name="ticketId"
              value={newPayment.ticketId}
              onChange={handleChange}
            >

              <option value="">
                Select Ticket
              </option>

              {tickets.map((ticket) => (

                <option
                  key={ticket.ticketId}
                  value={ticket.ticketId}
                >
                  {ticket.ticketId}
                </option>

              ))}

            </select>


            {/* Passenger Name */}

            <input
              type="text"
              name="passengerName"
              placeholder="Passenger Name"
              value={newPayment.passengerName}
              onChange={handleChange}
              readOnly
            />


            {/* Amount */}

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={handleChange}
              
            />


            {/* Payment Method */}

            <select
              name="paymentMethod"
              value={newPayment.paymentMethod}
              onChange={handleChange}
            >

              <option>UPI</option>

              <option>Debit Card</option>

              <option>Credit Card</option>

              <option>Net Banking</option>

              <option>Cash</option>

            </select>


            {/* Transaction ID */}

            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              value={newPayment.transactionId}
              onChange={handleChange}
            />


            {/* Status */}

            <select
              name="status"
              value={newPayment.status}
              onChange={handleChange}
            >

              <option>Paid</option>

              <option>Pending</option>

              <option>Failed</option>

              <option>Refunded</option>

            </select>

          </div>


          {/* ===========================
              BUTTONS
          =========================== */}

          <div className="button-group">

            <button
              className="add-bus-btn"
              onClick={
                editingPayment
                  ? handleUpdatePayment
                  : handleAddPayment
              }
            >

              {editingPayment
                ? "Update Payment"
                : "Add Payment"}

            </button>


            {editingPayment && (

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
            PAYMENT TABLE
        =========================== */}

        <table className="bus-table">

          <thead>

            <tr>

              <th>Payment ID</th>

              <th>Ticket ID</th>

              <th>Passenger</th>

              <th>Amount (₹)</th>

              <th>Method</th>

              <th>Transaction ID</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment._id}
              >

                <td>
                  {payment.paymentId}
                </td>

                <td>
                  {payment.ticketId}
                </td>

                <td>
                  {payment.passengerName}
                </td>

                <td>
                  {payment.amount}
                </td>

                <td>
                  {payment.paymentMethod}
                </td>

                <td>
                  {payment.transactionId}
                </td>

                <td>
                  {payment.status}
                </td>

                <td>

                  <button
                    onClick={() =>
                      handleEditPayment(payment)
                    }
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDeletePayment(payment)
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

export default PaymentManagement;