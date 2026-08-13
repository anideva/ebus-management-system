import { useState } from "react";
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

  const [payments, setPayments] = useState([
    {
      id: 1,
      paymentId: "PAY001",
      ticketId: "T001",
      passengerName: "Rahul Sharma",
      amount: "350",
      paymentMethod: "UPI",
      transactionId: "TXN100001",
      status: "Paid",
    },
    {
      id: 2,
      paymentId: "PAY002",
      ticketId: "T002",
      passengerName: "Priya Das",
      amount: "250",
      paymentMethod: "Card",
      transactionId: "TXN100002",
      status: "Paid",
    },
    {
      id: 3,
      paymentId: "PAY003",
      ticketId: "T003",
      passengerName: "Arjun Bora",
      amount: "450",
      paymentMethod: "Cash",
      transactionId: "TXN100003",
      status: "Pending",
    },
  
  ]);

  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================

 const handleChange = (e) => {

  const { name, value } = e.target;

  if (name === "ticketId") {

    const selectedTicket = tickets.find(
      (ticket) => ticket.ticketId === value
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

  const handleAddPayment = () => {

    if (
      !newPayment.paymentId.trim() ||
      !newPayment.ticketId.trim() ||
      !newPayment.passengerName.trim() ||
      !newPayment.amount.trim() ||
      !newPayment.transactionId.trim()
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    const paymentExists = payments.some(
      (payment) => payment.paymentId === newPayment.paymentId
    );

    if (paymentExists) {
      alert("Payment ID already exists!");
      return;
    }

    const transactionExists = payments.some(
  (payment) =>
    payment.transactionId === newPayment.transactionId
);

if (transactionExists) {
  alert("Transaction ID already exists!");
  return;
}

    const ticketPaymentExists = payments.some(
    (payment) =>
      payment.ticketId === newPayment.ticketId &&
      payment.status !== "Refunded"
  );

  if (ticketPaymentExists) {
    alert("A payment already exists for this ticket!");
    return;
  }

    setPayments([
      ...payments,
      newPayment,
    ]);

    setNewPayment({
      paymentId: "",
      ticketId: "",
      passengerName: "",
      amount: "",
      paymentMethod: "UPI",
      transactionId: "",
      status: "Paid",
    });

    setEditingPayment(null);
  };

  // ===========================
  // DELETE PAYMENT
  // ===========================

  const handleDeletePayment = (paymentId) => {

    const filteredPayments = payments.filter(
      (payment) => payment.paymentId !== paymentId
    );

    setPayments(filteredPayments);

    alert(`Payment ID ${paymentId} deleted successfully.`);
  };

  // ===========================
  // EDIT PAYMENT
  // ===========================

  const handleEditPayment = (payment) => {

    setNewPayment(payment);

    setEditingPayment(payment);

  };

  // ===========================
  // UPDATE PAYMENT
  // ===========================

  const handleUpdatePayment = () => {

    const duplicatePayment = payments.some(
      (payment) =>
        payment.paymentId === newPayment.paymentId &&
        payment.paymentId !== editingPayment.paymentId
    );

    if (duplicatePayment) {
      alert("Payment ID already exists!");
      return;
    }
      const duplicateTransaction = payments.some(
    (payment) =>
      payment.transactionId === newPayment.transactionId &&
      payment.paymentId !== editingPayment.paymentId
  );

  if (duplicateTransaction) {
    alert("Transaction ID already exists!");
    return;
  }

    

    const updatedPayments = payments.map((payment) => {

      if (payment.paymentId === editingPayment.paymentId) {
        return {
          ...payment,
          ...newPayment,
        };
      }

      return payment;

    });

    setPayments(updatedPayments);

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
    return (
    <div className="dashboard">

      <Sidebar />

      <div className="main-content">

        <Navbar userEmail="Admin" />

        <h1>💳 Payment Management</h1>

        <p>
          Manage all ticket payments from this page.
        </p>

        <div className="add-bus-form">

          <h2>Add New Payment</h2>

          <div className="form-grid">

            <input
              type="text"
              name="paymentId"
              placeholder="Payment ID"
              value={newPayment.paymentId}
              onChange={handleChange}
            />

            <select
  name="ticketId"
  value={newPayment.ticketId}
  onChange={handleChange}
>
  <option value="">Select Ticket</option>

  {tickets.map((ticket) => (
  <option
    key={ticket.ticketId}
    value={ticket.ticketId}
  >
    {ticket.ticketId}
  </option>
))}
</select>

            <input
              type="text"
              name="passengerName"
              placeholder="Passenger Name"
              value={newPayment.passengerName}
              onChange={handleChange}
              readOnly
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={handleChange}
              readOnly
            />

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

            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              value={newPayment.transactionId}
              onChange={handleChange}
            />

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

              <tr key={payment.paymentId}>

                <td>{payment.paymentId}</td>

                <td>{payment.ticketId}</td>

                <td>{payment.passengerName}</td>

                <td>{payment.amount}</td>

                <td>{payment.paymentMethod}</td>

                <td>{payment.transactionId}</td>

                <td>{payment.status}</td>

                <td>

                  <button
                    onClick={() => handleEditPayment(payment)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeletePayment(payment.paymentId)
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