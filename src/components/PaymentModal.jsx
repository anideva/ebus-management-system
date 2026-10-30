import { useState, useEffect } from "react";
import "../styles/paymentModal.css";

function PaymentModal({ isOpen, order, onSuccess, onClose }) {
  const [activeTab, setActiveTab] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");

  // UPI State
  const [upiId, setUpiId] = useState("commuter@okaxis");
  const [timeLeft, setTimeLeft] = useState(300);

  // Card State
  const [cardNumber, setCardNumber] = useState("4532 8912 3456 7890");
  const [cardHolder, setCardHolder] = useState(order?.passengerName || "Demo Commuter");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("SBI");

  // Countdown timer for UPI QR
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const executePayment = async (methodName) => {
    try {
      setProcessing(true);
      setProcessingStep("🔐 Establishing 256-bit encrypted banking session...");

      await new Promise((res) => setTimeout(res, 600));
      setProcessingStep("📡 Authorizing transit payment with banking network...");

      await new Promise((res) => setTimeout(res, 600));
      setProcessingStep("✅ Authorization confirmed! Generating verified ticket...");

      await new Promise((res) => setTimeout(res, 400));

      const transactionId = `TXN-EBUS-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;

      onSuccess({
        transactionId,
        paymentMethod: methodName,
        amount: order.amount,
        status: methodName === "Cash at Boarding" ? "Pending" : "Paid",
        paidAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment processing encountered an issue. Please try again.");
    } finally {
      setProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="payment-modal-header">
          <div className="payment-brand-title">
            <span>💳 Transit Gateway</span>
            <span className="payment-ssl-pill">🔒 256-Bit SSL</span>
          </div>
          <button
            type="button"
            className="payment-close-btn"
            onClick={onClose}
            disabled={processing}
            aria-label="Close Payment Modal"
          >
            ×
          </button>
        </div>

        {/* ORDER SUMMARY STRIP */}
        <div className="payment-summary-strip">
          <div>
            <div className="payment-item-desc">
              {order.itemSubtitle || "Assam Transit Corridor"}
            </div>
            <div className="payment-item-name">{order.itemTitle}</div>
          </div>
          <div className="payment-amount-box">
            <div className="payment-amount-label">Payable Amount</div>
            <div className="payment-amount-val">₹{order.amount}</div>
          </div>
        </div>

        {processing ? (
          /* PROCESSING SPINNER VIEW */
          <div className="gateway-processing-view">
            <div className="gateway-spinner" />
            <div className="gateway-processing-title">Processing Payment</div>
            <div className="gateway-processing-sub">{processingStep}</div>
          </div>
        ) : (
          /* INTERACTIVE GATEWAY TABS & INPUTS */
          <div>
            <div className="payment-method-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${activeTab === "upi" ? "active" : ""}`}
                onClick={() => setActiveTab("upi")}
              >
                <span>📱</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${activeTab === "card" ? "active" : ""}`}
                onClick={() => setActiveTab("card")}
              >
                <span>💳</span>
                <span>Card</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${
                  activeTab === "netbanking" ? "active" : ""
                }`}
                onClick={() => setActiveTab("netbanking")}
              >
                <span>🏦</span>
                <span>Net Banking</span>
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${activeTab === "cash" ? "active" : ""}`}
                onClick={() => setActiveTab("cash")}
              >
                <span>💵</span>
                <span>Cash</span>
              </button>
            </div>

            <div className="payment-tab-content">
              {/* TAB 1: UPI & DYNAMIC QR */}
              {activeTab === "upi" && (
                <div className="upi-qr-wrapper">
                  <div className="upi-qr-box">
                    {/* Simulated High-Res UPI QR Code */}
                    <svg
                      className="upi-qr-svg"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="100" height="100" fill="white" />
                      {/* Top-left position marker */}
                      <rect x="10" y="10" width="24" height="24" rx="3" fill="#1e293b" />
                      <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                      <rect x="18" y="18" width="8" height="8" rx="1" fill="#2563eb" />
                      {/* Top-right position marker */}
                      <rect x="66" y="10" width="24" height="24" rx="3" fill="#1e293b" />
                      <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                      <rect x="74" y="18" width="8" height="8" rx="1" fill="#2563eb" />
                      {/* Bottom-left position marker */}
                      <rect x="10" y="66" width="24" height="24" rx="3" fill="#1e293b" />
                      <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                      <rect x="18" y="74" width="8" height="8" rx="1" fill="#2563eb" />
                      {/* Data Pattern */}
                      <rect x="42" y="12" width="6" height="6" fill="#1e293b" />
                      <rect x="52" y="12" width="6" height="6" fill="#1e293b" />
                      <rect x="42" y="24" width="16" height="6" fill="#1e293b" />
                      <rect x="12" y="44" width="6" height="14" fill="#1e293b" />
                      <rect x="24" y="44" width="12" height="6" fill="#1e293b" />
                      <rect x="44" y="40" width="14" height="14" rx="2" fill="#2563eb" />
                      <rect x="66" y="44" width="22" height="6" fill="#1e293b" />
                      <rect x="82" y="56" width="6" height="18" fill="#1e293b" />
                      <rect x="42" y="66" width="6" height="22" fill="#1e293b" />
                      <rect x="54" y="66" width="14" height="6" fill="#1e293b" />
                      <rect x="54" y="78" width="8" height="10" fill="#1e293b" />
                      <rect x="70" y="80" width="18" height="8" fill="#1e293b" />
                    </svg>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b" }}>
                      Scan with GPay / PhonePe / Paytm
                    </span>
                  </div>

                  <div className="upi-timer-text">
                    QR expires in: <span className="upi-timer-val">{formatTimer(timeLeft)}</span>
                  </div>

                  <div className="upi-divider">
                    <span>OR ENTER UPI ID</span>
                  </div>

                  <div className="gateway-field">
                    <label htmlFor="upi-vpa-input">Virtual Payment Address (VPA)</label>
                    <input
                      id="upi-vpa-input"
                      type="text"
                      placeholder="e.g. mobile@upi or name@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="gateway-pay-btn"
                    onClick={() => executePayment("UPI / QR")}
                  >
                    🔒 Pay ₹{order.amount} via UPI
                  </button>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {activeTab === "card" && (
                <div>
                  <div className="gateway-field">
                    <label htmlFor="card-number-input">Card Number</label>
                    <input
                      id="card-number-input"
                      type="text"
                      placeholder="4532 8912 3456 7890"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                  </div>

                  <div className="gateway-field">
                    <label htmlFor="card-holder-input">Cardholder Name</label>
                    <input
                      id="card-holder-input"
                      type="text"
                      placeholder="Name as on card"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>

                  <div className="card-grid-row">
                    <div className="gateway-field">
                      <label htmlFor="card-expiry-input">Expiry Date</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="gateway-field">
                      <label htmlFor="card-cvv-input">CVV / CVC</label>
                      <input
                        id="card-cvv-input"
                        type="password"
                        placeholder="•••"
                        maxLength="4"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="gateway-pay-btn"
                    onClick={() => executePayment("Card")}
                  >
                    🔒 Pay ₹{order.amount} via Card
                  </button>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === "netbanking" && (
                <div>
                  <div className="gateway-field">
                    <label>Select Your Bank</label>
                    <div className="popular-banks-grid">
                      {["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          className={`bank-option-btn ${
                            selectedBank === bank ? "selected" : ""
                          }`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="gateway-field">
                    <label htmlFor="other-banks-select">All Available Indian Banks</label>
                    <select
                      id="other-banks-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="SBI">State Bank of India</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="Axis">Axis Bank</option>
                      <option value="PNB">Punjab National Bank</option>
                      <option value="Kotak">Kotak Mahindra Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                      <option value="Canara">Canara Bank</option>
                      <option value="Union">Union Bank of India</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="gateway-pay-btn"
                    onClick={() => executePayment(`Net Banking (${selectedBank})`)}
                  >
                    🔒 Pay ₹{order.amount} via {selectedBank}
                  </button>
                </div>
              )}

              {/* TAB 4: CASH AT BOARDING */}
              {activeTab === "cash" && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>💵</div>
                  <h4 style={{ margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                    Cash at Boarding / Counter
                  </h4>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.5",
                      marginBottom: "20px",
                    }}
                  >
                    Your seat will be reserved immediately. You can pay cash directly to the bus conductor or station master upon boarding.
                  </p>

                  <button
                    type="button"
                    className="gateway-pay-btn"
                    onClick={() => executePayment("Cash at Boarding")}
                  >
                    Confirm Reservation (Pay ₹{order.amount} Later)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
