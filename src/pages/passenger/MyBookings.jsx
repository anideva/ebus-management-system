import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import PassengerNavbar from "../../components/PassengerNavbar";
import TicketModal from "../../components/TicketModal";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import "../../styles/passenger.css";

function MyBookings() {
  const { user, token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [activeViewingTicket, setActiveViewingTicket] = useState(null);

  // FETCH TICKETS
  const fetchMyTickets = useCallback(async () => {
    try {
      setLoading(true);
      const authToken = token || (await user?.getIdToken());
      if (!authToken) return;

      const res = await fetch(`${API_BASE_URL}/api/portal/my-tickets`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load your tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      if (!user) return;
      try {
        const authToken = token || (await user.getIdToken());
        if (!authToken || ignore) return;

        const res = await fetch(`${API_BASE_URL}/api/portal/my-tickets`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load your tickets");
        const data = await res.json();
        if (!ignore) {
          setTickets(data);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [user, token]);

  // CANCEL TICKET HANDLER
  const handleCancelTicket = async (ticket) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel Ticket #${ticket.ticketId}? This will release your seat reservation and mark the internal payment record as Refunded (no external banking refund is disbursed).`
    );
    if (!confirmed) return;

    try {
      setCancellingId(ticket.ticketId);
      setActionMessage(null);
      const authToken = token || (await user?.getIdToken());

      const res = await fetch(
        `${API_BASE_URL}/api/portal/cancel-ticket/${encodeURIComponent(
          ticket.ticketId
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to cancel ticket");
      }

      setActionMessage({
        type: "success",
        text: `Ticket #${ticket.ticketId} cancelled. Reservation released and payment marked as Refunded in system records.`,
      });

      // Refresh tickets
      fetchMyTickets();
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      setActionMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="passenger-layout">
      <PassengerNavbar />

      <main className="passenger-container">
        <header className="passenger-page-header">
          <h1>My Booked Tickets</h1>
          <p>View your past and upcoming journey bookings, download tickets, or request cancellations.</p>
        </header>

        {actionMessage && (
          <div
            style={{
              backgroundColor:
                actionMessage.type === "success"
                  ? "var(--success-light)"
                  : "var(--danger-light)",
              color:
                actionMessage.type === "success"
                  ? "var(--success)"
                  : "var(--danger)",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "0.9rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{actionMessage.text}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                color: "inherit",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading your bookings...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">🎟️</div>
            <h3>No Bookings Found</h3>
            <p>You haven't booked any bus journeys yet.</p>
            <Link
              to="/passenger/book"
              className="btn-primary-action"
              style={{ display: "inline-flex", marginTop: "16px", textDecoration: "none" }}
            >
              Book Your First Journey
            </Link>
          </div>
        ) : (
          <div>
            {tickets.map((ticket) => {
              const isBooked = ticket.status === "Booked";
              const isCancelled = ticket.status === "Cancelled";

              return (
                <div key={ticket._id || ticket.ticketId} className="booking-card">
                  <div className="booking-info-main">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h4>{ticket.routeName}</h4>
                      <span
                        className={
                          isBooked
                            ? "badge-status-booked"
                            : isCancelled
                            ? "badge-status-cancelled"
                            : "badge-status-active"
                        }
                      >
                        ● {ticket.status}
                      </span>
                    </div>

                    <div className="booking-details-grid">
                      <div>
                        <strong>Ticket ID:</strong> {ticket.ticketId}
                      </div>
                      <div>
                        <strong>Bus:</strong> {ticket.busNumber}
                      </div>
                      <div>
                        <strong>Date:</strong> {ticket.journeyDate}
                      </div>
                      <div>
                        <strong>Seat:</strong> #{ticket.seatNumber}
                      </div>
                      <div>
                        <strong>Fare:</strong> ₹{ticket.fare}
                      </div>
                      <div>
                        <strong>Passenger:</strong> {ticket.passengerName}
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Total Paid
                      </span>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        ₹{ticket.fare}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setActiveViewingTicket(ticket)}
                        className="btn-primary-action"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.82rem",
                          gap: "6px",
                        }}
                      >
                        🎫 View / Print Pass
                      </button>

                      {isBooked && (
                        <button
                          type="button"
                          disabled={cancellingId === ticket.ticketId}
                          onClick={() => handleCancelTicket(ticket)}
                          style={{
                            backgroundColor: "transparent",
                            color: "var(--danger)",
                            border: "1px solid var(--danger)",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {cancellingId === ticket.ticketId ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* PRINTABLE BOARDING PASS / PDF TICKET MODAL */}
      {activeViewingTicket && (
        <TicketModal
          ticket={activeViewingTicket}
          onClose={() => setActiveViewingTicket(null)}
        />
      )}
    </div>
  );
}

export default MyBookings;
