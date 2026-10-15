import { useEffect, useState, useCallback } from "react";
import PassengerNavbar from "../../components/PassengerNavbar";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";
import "../../styles/passenger.css";

function MyPasses() {
  const { user, token } = useAuth();

  const [passes, setPasses] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // FORM STATES
  const [studentName, setStudentName] = useState(user?.displayName || "");
  const [studentId, setStudentId] = useState("");
  const [selectedBusNumber, setSelectedBusNumber] = useState("");
  const [selectedRouteName, setSelectedRouteName] = useState("");
  const [passType, setPassType] = useState("Monthly");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // FETCH PASSES REFRESH
  const fetchMyPasses = useCallback(async () => {
    try {
      setLoading(true);
      const authToken = token || (await user?.getIdToken());
      if (!authToken) return;

      const res = await fetch(`${API_BASE_URL}/api/portal/my-passes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load passes");
      const data = await res.json();
      setPasses(data);
    } catch (err) {
      console.error("Error fetching passes:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      if (!user) return;
      try {
        const authToken = token || (await user.getIdToken());
        if (!authToken || ignore) return;

        const [passesRes, busesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/portal/my-passes`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`${API_BASE_URL}/api/portal/services`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        if (passesRes.ok) {
          const passData = await passesRes.json();
          if (!ignore) setPasses(passData);
        }

        if (busesRes.ok) {
          const busData = await busesRes.json();
          if (!ignore) {
            setBuses(busData);
            if (busData.length > 0) {
              setSelectedBusNumber(busData[0].busNumber);
              setSelectedRouteName(busData[0].routeName);
            }
          }
        }
      } catch (err) {
        console.error("Error loading pass data:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [user, token]);

  // ON BUS SELECT CHANGE
  const handleBusChange = (e) => {
    const busNum = e.target.value;
    setSelectedBusNumber(busNum);
    const bus = buses.find((b) => b.busNumber === busNum);
    if (bus) {
      setSelectedRouteName(bus.routeName);
    }
  };

  // SUBMIT APPLICATION
  const handleApplyPass = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim() || !selectedBusNumber) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");
      const authToken = token || (await user?.getIdToken());

      const res = await fetch(`${API_BASE_URL}/api/portal/apply-pass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentId: studentId.trim(),
          busNumber: selectedBusNumber,
          routeName: selectedRouteName,
          passType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to apply for pass");
      }

      setFormSuccess("Bus pass issued successfully!");
      fetchMyPasses();
      setTimeout(() => {
        setModalOpen(false);
        setFormSuccess("");
      }, 1200);
    } catch (err) {
      console.error("Error applying for pass:", err);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDaysRemaining = (validUntilDate) => {
    const today = new Date();
    const expiry = new Date(validUntilDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="passenger-layout">
      <PassengerNavbar />

      <main className="passenger-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <header className="passenger-page-header" style={{ marginBottom: 0 }}>
            <h1>Student & Commuter Bus Passes</h1>
            <p>Manage your active transport passes or apply for a discounted monthly or term pass.</p>
          </header>

          <button
            type="button"
            className="btn-primary-action"
            onClick={() => {
              setModalOpen(true);
              setFormError("");
              setFormSuccess("");
            }}
          >
            ➕ Apply for Pass
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading your passes...</p>
          </div>
        ) : passes.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">🪪</div>
            <h3>No Bus Passes Issued Yet</h3>
            <p>You don't have any bus passes right now. Apply for a monthly, quarterly, or yearly pass for hassle-free daily travel.</p>
            <button
              type="button"
              className="btn-primary-action"
              style={{ marginTop: "16px" }}
              onClick={() => setModalOpen(true)}
            >
              Apply for a New Pass
            </button>
          </div>
        ) : (
          <div>
            {passes.map((pass) => {
              const daysRemaining = calculateDaysRemaining(pass.validUntil);
              const isExpired = daysRemaining <= 0 || pass.status === "Expired";

              return (
                <div key={pass._id || pass.passId} className="booking-card">
                  <div className="booking-info-main">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h4>{pass.routeName}</h4>
                      <span
                        className={
                          !isExpired
                            ? "badge-status-active"
                            : "badge-status-cancelled"
                        }
                      >
                        ● {!isExpired ? "Active" : "Expired"}
                      </span>
                      <span
                        style={{
                          backgroundColor: "var(--primary-light)",
                          color: "var(--primary)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {pass.passType} Pass
                      </span>
                    </div>

                    <div className="booking-details-grid">
                      <div>
                        <strong>Pass ID:</strong> {pass.passId}
                      </div>
                      <div>
                        <strong>Student / Holder:</strong> {pass.studentName} ({pass.studentId})
                      </div>
                      <div>
                        <strong>Bus:</strong> {pass.busNumber}
                      </div>
                      <div>
                        <strong>Valid From:</strong> {new Date(pass.validFrom).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Valid Until:</strong> {new Date(pass.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <div style={{ textAlign: "right" }}>
                      {!isExpired ? (
                        <div style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.9rem" }}>
                          ✓ {daysRemaining} days remaining
                        </div>
                      ) : (
                        <div style={{ color: "var(--danger)", fontWeight: 600, fontSize: "0.9rem" }}>
                          Expired
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* APPLICATION MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Apply for Bus Pass</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>

            {formError && (
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
                ⚠️ {formError}
              </div>
            )}

            {formSuccess && (
              <div
                style={{
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.88rem",
                }}
              >
                ✓ {formSuccess}
              </div>
            )}

            <form onSubmit={handleApplyPass}>
              <div className="form-group-custom" style={{ marginBottom: "14px" }}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter student / commuter name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom" style={{ marginBottom: "14px" }}>
                <label>Student / Employee ID</label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-089"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-custom" style={{ marginBottom: "14px" }}>
                <label>Bus & Route</label>
                <select
                  value={selectedBusNumber}
                  onChange={handleBusChange}
                  required
                >
                  {buses.map((bus) => (
                    <option key={bus._id} value={bus.busNumber}>
                      Bus {bus.busNumber} — {bus.routeName} ({bus.source} to {bus.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-custom" style={{ marginBottom: "20px" }}>
                <label>Pass Type</label>
                <select
                  value={passType}
                  onChange={(e) => setPassType(e.target.value)}
                >
                  <option value="Monthly">Monthly Pass (30 Days)</option>
                  <option value="Quarterly">Quarterly Pass (90 Days)</option>
                  <option value="Yearly">Yearly Pass (365 Days)</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-action"
                >
                  {submitting ? "Issuing..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPasses;
