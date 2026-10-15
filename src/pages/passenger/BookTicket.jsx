import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import PassengerNavbar from "../../components/PassengerNavbar";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import "../../styles/passenger.css";

function BookTicket() {
  const { user, token } = useAuth();

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // STATES
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [journeyDate, setJourneyDate] = useState(getTodayString());

  // SEAT SELECTION & BOOKING STATES
  const [selectedBus, setSelectedBus] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState("");

  // FETCH SERVICES
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      const authToken = token || (await user?.getIdToken());
      if (!authToken) return;

      const params = new URLSearchParams();
      if (sourceQuery.trim()) params.append("source", sourceQuery.trim());
      if (destinationQuery.trim()) params.append("destination", destinationQuery.trim());

      const res = await fetch(`${API_BASE_URL}/api/portal/services?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoadingServices(false);
    }
  }, [token, user, sourceQuery, destinationQuery]);

  useEffect(() => {
    let ignore = false;

    const loadInitialServices = async () => {
      if (!user) return;
      try {
        const authToken = token || (await user.getIdToken());
        if (!authToken || ignore) return;

        const params = new URLSearchParams();
        if (sourceQuery.trim()) params.append("source", sourceQuery.trim());
        if (destinationQuery.trim()) params.append("destination", destinationQuery.trim());

        const res = await fetch(`${API_BASE_URL}/api/portal/services?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        if (!ignore) {
          setServices(data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        if (!ignore) {
          setLoadingServices(false);
        }
      }
    };

    loadInitialServices();

    return () => {
      ignore = true;
    };
  }, [user, token, sourceQuery, destinationQuery]);

  // LOAD SEAT AVAILABILITY FOR SELECTED BUS
  const handleSelectBus = async (bus) => {
    setSelectedBus(bus);
    setSelectedSeat(null);
    setBookingError("");
    setBookingSuccess(null);
    setLoadingSeats(true);

    try {
      const authToken = token || (await user?.getIdToken());
      const res = await fetch(
        `${API_BASE_URL}/api/portal/availability?busNumber=${encodeURIComponent(
          bus.busNumber
        )}&journeyDate=${encodeURIComponent(journeyDate)}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load seat availability");
      const data = await res.json();
      setSeatData(data);
    } catch (err) {
      console.error("Error loading seats:", err);
      setBookingError("Failed to fetch seat availability for this date.");
    } finally {
      setLoadingSeats(false);
    }
  };

  // CONFIRM BOOKING HANDLER
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedBus || !selectedSeat) {
      alert("Please select a seat first.");
      return;
    }

    try {
      setIsSubmitting(true);
      setBookingError("");
      const authToken = token || (await user?.getIdToken());

      const response = await fetch(`${API_BASE_URL}/api/portal/book-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          busNumber: selectedBus.busNumber,
          routeName: selectedBus.routeName,
          journeyDate,
          seatNumber: selectedSeat,
          passengerName: user?.displayName || user?.email?.split("@")[0] || "Passenger",
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setBookingSuccess(result);
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedBus(null);
    setSeatData(null);
    setSelectedSeat(null);
    setBookingSuccess(null);
    setBookingError("");
  };

  return (
    <div className="passenger-layout">
      <PassengerNavbar />

      <main className="passenger-container">
        <header className="passenger-page-header">
          <h1>Find & Book Bus Services</h1>
          <p>
            Choose your journey date, search available routes, and pick your preferred seat with instant confirmation.
          </p>
        </header>

        {/* SEARCH AND FILTER BAR */}
        <div className="passenger-search-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchServices();
            }}
            className="search-form-grid"
          >
            <div className="form-group-custom">
              <label htmlFor="source-input">From (Source / Stop)</label>
              <input
                id="source-input"
                type="text"
                placeholder="e.g. Main Campus or Central"
                value={sourceQuery}
                onChange={(e) => setSourceQuery(e.target.value)}
              />
            </div>

            <div className="form-group-custom">
              <label htmlFor="destination-input">To (Destination / Stop)</label>
              <input
                id="destination-input"
                type="text"
                placeholder="e.g. City Terminal"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
              />
            </div>

            <div className="form-group-custom">
              <label htmlFor="journey-date-input">Journey Date</label>
              <input
                id="journey-date-input"
                type="date"
                min={getTodayString()}
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn-primary-action">
                🔍 Search
              </button>
              {(sourceQuery || destinationQuery) && (
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => {
                    setSourceQuery("");
                    setDestinationQuery("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SERVICES LIST */}
        {loadingServices ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading available bus services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">🚌</div>
            <h3>No bus services found</h3>
            <p>No active buses match your search criteria. Try modifying your source or destination.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((bus) => (
              <div key={bus._id} className="service-card">
                <div>
                  <div className="service-card-top">
                    <div>
                      <h3 className="service-title">{bus.routeName}</h3>
                      <span className="service-bus-badge">
                        Bus {bus.busNumber} • {bus.busType}
                      </span>
                    </div>
                  </div>

                  <div className="service-route-section">
                    <span className="route-endpoint">{bus.source}</span>
                    <span className="route-arrow">➔</span>
                    <span className="route-endpoint">{bus.destination}</span>
                  </div>

                  <div className="service-meta-row">
                    <span className="service-meta-item">
                      ⏱️ {bus.estimatedTime ? `${bus.estimatedTime} mins` : "Scheduled"}
                    </span>
                    <span className="service-meta-item">
                      🛣️ {bus.distance ? `${bus.distance} km` : "Standard route"}
                    </span>
                    <span className="service-meta-item">
                      💺 {bus.capacity} seats
                    </span>
                  </div>

                  {bus.stops && bus.stops.length > 0 && (
                    <div className="service-stops-taglist">
                      {bus.stops.map((stop, idx) => (
                        <span key={idx} className="stop-tag">
                          📍 {stop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="service-card-bottom">
                  <div className="fare-tag">
                    <span className="fare-label">One-way Fare</span>
                    <span className="fare-amount">₹{bus.fare}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => handleSelectBus(bus)}
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* SEAT SELECTION & BOOKING MODAL */}
      {selectedBus && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div>
                <h3>{selectedBus.routeName} (Bus {selectedBus.busNumber})</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Date: {journeyDate}
                </span>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ color: "var(--success)", margin: "0 0 8px 0" }}>
                  Booking Confirmed!
                </h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
                  Your ticket has been booked successfully.
                </p>

                <div
                  style={{
                    backgroundColor: "var(--bg-surface-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "left",
                    marginBottom: "24px",
                    fontSize: "0.9rem",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  <div>
                    <strong>Ticket ID:</strong> {bookingSuccess.ticket?.ticketId}
                  </div>
                  <div>
                    <strong>Seat Number:</strong> Seat #{bookingSuccess.ticket?.seatNumber}
                  </div>
                  <div>
                    <strong>Passenger:</strong> {bookingSuccess.ticket?.passengerName}
                  </div>
                  <div>
                    <strong>Fare Paid:</strong> ₹{bookingSuccess.ticket?.fare} ({paymentMethod})
                  </div>
                  <div>
                    <strong>Journey Date:</strong> {bookingSuccess.ticket?.journeyDate}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <Link to="/passenger/bookings" className="btn-primary-action">
                    View My Bookings
                  </Link>
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {loadingSeats ? (
                  <div style={{ textAlign: "center", padding: "30px" }}>
                    <p>Loading live seat layout...</p>
                  </div>
                ) : (
                  <div>
                    {bookingError && (
                      <div
                        style={{
                          backgroundColor: "var(--danger-light)",
                          color: "var(--danger)",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                          fontSize: "0.88rem",
                        }}
                      >
                        ⚠️ {bookingError}
                      </div>
                    )}

                    <div className="seat-legend">
                      <div className="legend-item">
                        <div className="legend-box available" />
                        <span>Available</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-box booked" />
                        <span>Booked</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-box selected" />
                        <span>Selected</span>
                      </div>
                    </div>

                    <div className="bus-seat-container">
                      <div className="driver-steering-icon">🚗 Driver Cabin</div>
                      <div className="seat-grid-bus">
                        {Array.from(
                          { length: seatData?.capacity || selectedBus.capacity || 40 },
                          (_, idx) => {
                            const seatNum = String(idx + 1);
                            const isBooked = seatData?.bookedSeats?.includes(seatNum);
                            const isSelected = selectedSeat === seatNum;

                            return (
                              <button
                                key={seatNum}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedSeat(seatNum)}
                                className={`seat-button ${
                                  isSelected ? "selected" : ""
                                }`}
                                title={isBooked ? `Seat ${seatNum} is Booked` : `Select Seat ${seatNum}`}
                              >
                                <span>{seatNum}</span>
                                <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                                  {isBooked ? "Booked" : "₹" + selectedBus.fare}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleConfirmBooking}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "14px",
                          marginBottom: "18px",
                        }}
                      >
                        <div className="form-group-custom">
                          <label>Selected Seat</label>
                          <input
                            type="text"
                            value={selectedSeat ? `Seat #${selectedSeat}` : "None selected"}
                            disabled
                            style={{ fontWeight: 600 }}
                          />
                        </div>

                        <div className="form-group-custom">
                          <label>Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option value="UPI">UPI / QR</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Net Banking">Net Banking</option>
                            <option value="Cash">Cash at Boarding</option>
                          </select>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "14px",
                          borderTop: "1px solid var(--border-color)",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            Total Payable
                          </span>
                          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--primary)" }}>
                            ₹{selectedSeat ? selectedBus.fare : 0}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!selectedSeat || isSubmitting}
                            className="btn-primary-action"
                          >
                            {isSubmitting ? "Processing..." : "Confirm & Pay"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTicket;
