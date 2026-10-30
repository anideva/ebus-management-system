import { useEffect } from "react";
import "../styles/passenger.css";

function TicketModal({ ticket, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  // Scannable verification data for the QR code
  const qrVerificationData = `E-BUS TRANSIT PASS | Ticket #${ticket.ticketId} | Passenger: ${ticket.passengerName} | Bus: ${ticket.busNumber} | Seat: #${ticket.seatNumber} | Date: ${ticket.journeyDate} | Fare: Rs.${ticket.fare} | Status: ${ticket.status || "Booked"}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    qrVerificationData
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content-custom boarding-pass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px", width: "95%", padding: "0", overflow: "hidden" }}
      >
        {/* MODAL ACTION BAR (HIDDEN IN PRINT) */}
        <div className="modal-header-custom no-print" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🎫</span>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Boarding Pass & E-Ticket</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              className="btn-primary-action"
              onClick={handlePrint}
              style={{ padding: "6px 14px", fontSize: "0.85rem", gap: "6px" }}
            >
              🖨️ Print / Save PDF
            </button>
            <button
              type="button"
              className="btn-close-modal"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* PRINTABLE BOARDING PASS CARD */}
        <div className="boarding-pass-print-area">
          <div className="boarding-pass-card">
            {/* PASS HEADER */}
            <div className="boarding-pass-header">
              <div className="boarding-brand">
                <span className="boarding-logo">🚍</span>
                <div>
                  <h2 className="boarding-agency-name">E-BUS TRANSIT MANAGEMENT</h2>
                  <span className="boarding-pass-type">OFFICIAL PASSENGER BOARDING PASS</span>
                </div>
              </div>
              <div className="boarding-status-pill">
                ● {ticket.status || "CONFIRMED"}
              </div>
            </div>

            {/* ROUTE HIGHLIGHT BAR */}
            <div className="boarding-route-bar">
              <div className="boarding-route-title">
                {ticket.routeName || "Regional Transit Service"}
              </div>
              <div className="boarding-ticket-code">
                Ticket #{ticket.ticketId}
              </div>
            </div>

            {/* PASSENGER & JOURNEY DETAILS GRID */}
            <div className="boarding-details-grid">
              <div className="boarding-detail-item">
                <span className="boarding-label">PASSENGER NAME</span>
                <span className="boarding-value">{ticket.passengerName}</span>
              </div>

              <div className="boarding-detail-item">
                <span className="boarding-label">JOURNEY DATE</span>
                <span className="boarding-value">{ticket.journeyDate}</span>
              </div>

              <div className="boarding-detail-item">
                <span className="boarding-label">BUS NUMBER</span>
                <span className="boarding-value">{ticket.busNumber}</span>
              </div>

              <div className="boarding-detail-item">
                <span className="boarding-label">SEAT ALLOCATION</span>
                <span className="boarding-value-highlight">SEAT #{ticket.seatNumber}</span>
              </div>

              <div className="boarding-detail-item">
                <span className="boarding-label">TOTAL FARE PAID</span>
                <span className="boarding-value">₹{ticket.fare}</span>
              </div>

              <div className="boarding-detail-item">
                <span className="boarding-label">PAYMENT METHOD</span>
                <span className="boarding-value">{ticket.paymentMethod || "Online (UPI)"}</span>
              </div>
            </div>

            {/* PERFORATED TEAR-OFF LINE */}
            <div className="boarding-tear-line">
              <div className="tear-circle left" />
              <div className="tear-dashes" />
              <div className="tear-circle right" />
            </div>

            {/* QR CODE & BARCODE STUB */}
            <div className="boarding-stub-footer">
              <div className="boarding-qr-box">
                <img
                  src={qrUrl}
                  alt={`QR Verification for Ticket #${ticket.ticketId}`}
                  className="boarding-qr-image"
                  loading="lazy"
                />
                <span className="boarding-qr-caption">Scan to Verify Ticket</span>
              </div>

              <div className="boarding-instructions">
                <h4>Transit Boarding Guidelines</h4>
                <ul>
                  <li>Present this digital or printed pass along with a valid photo ID.</li>
                  <li>Arrive at the boarding terminal at least 15 minutes before scheduled departure.</li>
                  <li>In case of itinerary changes, cancellation is supported via your Passenger Portal.</li>
                </ul>
                <div className="boarding-barcode-graphic" aria-hidden="true">
                  ||| | ||||| | || ||||| ||| || | |||| ||| | ||| ||||
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CLOSE BAR (HIDDEN IN PRINT) */}
        <div
          className="no-print"
          style={{
            padding: "14px 20px",
            backgroundColor: "var(--bg-surface-secondary)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button type="button" className="btn-secondary-action" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary-action" onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketModal;
