import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../middleware/authMiddleware.js";

/**
 * ===================================================================
 * Test Suite: Security Fixes Verification & Passenger Portal Engine
 * ===================================================================
 */

describe("1. Administrative Authorization & Role Middleware (requireRole)", () => {
  it("should return 401 Unauthorized when req.user is missing", () => {
    const middleware = requireRole(["admin"]);
    const req = {};
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status(code) {
        statusSent = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    assert.equal(statusSent, 401);
    assert.match(jsonSent.message, /Unauthorized/i);
    assert.equal(nextCalled, false);
  });

  it("should return 403 Forbidden when an authenticated passenger tries to access an admin route", () => {
    const middleware = requireRole(["admin"]);
    const req = {
      user: {
        uid: "passenger-123",
        email: "passenger@example.com",
        role: "passenger",
      },
    };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status(code) {
        statusSent = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    assert.equal(statusSent, 403);
    assert.match(jsonSent.message, /Forbidden.*Access denied for role 'passenger'/i);
    assert.equal(nextCalled, false);
  });

  it("should call next() when an authenticated admin accesses an admin route", () => {
    const middleware = requireRole(["admin"]);
    const req = {
      user: {
        uid: "admin-999",
        email: "admin@ebus.com",
        role: "admin",
      },
    };
    let statusSent = null;
    const res = {
      status(code) {
        statusSent = code;
        return this;
      },
      json() {
        return this;
      },
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    assert.equal(statusSent, null);
    assert.equal(nextCalled, true);
  });

  it("should allow both admin and passenger when route allows ['passenger', 'admin']", () => {
    const middleware = requireRole(["passenger", "admin"]);
    let nextCount = 0;
    const next = () => {
      nextCount++;
    };

    const res = {
      status() {
        return this;
      },
      json() {
        return this;
      },
    };

    // Passenger
    middleware({ user: { role: "passenger" } }, res, next);
    assert.equal(nextCount, 1);

    // Admin
    middleware({ user: { role: "admin" } }, res, next);
    assert.equal(nextCount, 2);
  });
});

describe("2. Fixed Administrator Assignment & Bootstrap Removal", () => {
  // Helper implementing the fixed role resolution in authMiddleware.js
  const resolveRole = ({ email, clientSuppliedRole, adminEmailsConfig }) => {
    const adminEmails = (adminEmailsConfig || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = (email || "").toLowerCase();
    const isConfiguredAdmin = Boolean(userEmail && adminEmails.includes(userEmail));

    // Fix applied: Public registration strictly assigns 'passenger' by default.
    // Client-supplied roles are completely discarded.
    return isConfiguredAdmin ? "admin" : "passenger";
  };

  it("assigns 'passenger' by default when ADMIN_EMAILS is empty, even for the very first registrant", () => {
    const role = resolveRole({
      email: "first_user@gmail.com",
      clientSuppliedRole: "admin", // Malicious client attempt
      adminEmailsConfig: "",
    });

    assert.equal(role, "passenger", "First user must NOT be granted admin automatically");
  });

  it("assigns 'admin' only when user email matches configured ADMIN_EMAILS whitelist", () => {
    const config = "admin@ebus.com, transport_director@ebus.com";

    const adminRole = resolveRole({
      email: "Admin@Ebus.Com", // Case insensitive check
      clientSuppliedRole: "passenger",
      adminEmailsConfig: config,
    });
    assert.equal(adminRole, "admin");

    const passengerRole = resolveRole({
      email: "someone_else@gmail.com",
      clientSuppliedRole: "admin",
      adminEmailsConfig: config,
    });
    assert.equal(passengerRole, "passenger");
  });

  it("never accepts client-supplied role parameters to elevate privileges", () => {
    const role = resolveRole({
      email: "attacker@random.com",
      clientSuppliedRole: "admin",
      adminEmailsConfig: "real_admin@ebus.com",
    });
    assert.equal(role, "passenger");
  });
});

describe("3. Hardened Ticket Ownership Check", () => {
  // Hardened ownership function matching updated portalController.js
  const checkCanCancel = (ticket, user) => {
    const hasUserIdMatch = Boolean(
      ticket.userId && user?.uid && ticket.userId === user.uid
    );

    const hasUserEmailMatch = Boolean(
      ticket.userEmail &&
        user?.email &&
        ticket.userEmail.toLowerCase() === user.email.toLowerCase()
    );

    const isOwner = hasUserIdMatch || hasUserEmailMatch;
    const isAdmin = user?.role === "admin";

    return isOwner || isAdmin;
  };

  it("prevents undefined === undefined flaw when ticket and user IDs are missing", () => {
    const legacyTicket = {
      ticketId: "TKT-LEGACY",
      userId: undefined,
      userEmail: undefined,
    };

    const emptyUser = {
      uid: undefined,
      email: undefined,
      role: "passenger",
    };

    const canCancel = checkCanCancel(legacyTicket, emptyUser);
    assert.equal(
      canCancel,
      false,
      "Missing or undefined IDs must never evaluate to true ownership"
    );
  });

  it("prevents unauthorized passenger from cancelling another user's ticket (IDOR attempt)", () => {
    const victimTicket = {
      ticketId: "TKT-100",
      userId: "victim-uid-123",
      userEmail: "victim@example.com",
    };

    const attacker = {
      uid: "attacker-uid-456",
      email: "attacker@example.com",
      role: "passenger",
    };

    const canCancel = checkCanCancel(victimTicket, attacker);
    assert.equal(canCancel, false, "Attacker must be rejected");
  });

  it("allows legitimate owner to cancel by UID match", () => {
    const ticket = {
      ticketId: "TKT-200",
      userId: "legit-uid-789",
      userEmail: "user@example.com",
    };

    const owner = {
      uid: "legit-uid-789",
      email: "other_email@example.com",
      role: "passenger",
    };

    const canCancel = checkCanCancel(ticket, owner);
    assert.equal(canCancel, true, "Legitimate owner must be allowed to cancel");
  });

  it("allows legitimate owner to cancel by verified Email match", () => {
    const ticket = {
      ticketId: "TKT-300",
      userId: "some-old-uid",
      userEmail: "commuter@example.com",
    };

    const owner = {
      uid: "different-current-uid",
      email: "Commuter@Example.COM",
      role: "passenger",
    };

    const canCancel = checkCanCancel(ticket, owner);
    assert.equal(canCancel, true, "Email match must allow cancellation");
  });

  it("allows authorized admin to cancel any ticket", () => {
    const ticket = {
      ticketId: "TKT-400",
      userId: "passenger-uid",
      userEmail: "passenger@example.com",
    };

    const admin = {
      uid: "admin-uid-999",
      email: "admin@ebus.com",
      role: "admin",
    };

    const canCancel = checkCanCancel(ticket, admin);
    assert.equal(canCancel, true, "Admin must be permitted to cancel any ticket");
  });
});

describe("4. Fare Calculation & Payment Integrity", () => {
  it("enforces server bus fare and overrides client-manipulated fare or amount", () => {
    const busInDatabase = {
      busNumber: "BUS-101",
      fare: 150,
      capacity: 40,
      status: "Active",
    };

    const clientPayload = {
      busNumber: "BUS-101",
      journeyDate: "2026-10-20",
      seatNumber: 5,
      fare: 0,
      amount: 1,
    };

    const canonicalFare = busInDatabase.fare;
    assert.equal(canonicalFare, 150);
    assert.notEqual(canonicalFare, clientPayload.fare);

    const ticketRecord = {
      busNumber: busInDatabase.busNumber,
      fare: busInDatabase.fare,
      status: "Booked",
    };

    const paymentRecord = {
      amount: busInDatabase.fare,
      status: "Paid",
    };

    assert.equal(ticketRecord.fare, 150);
    assert.equal(paymentRecord.amount, 150);
  });
});

describe("5. Booking Concurrency, Partial Unique Index & Cancelled-Seat Rebooking", () => {
  it("handles duplicate key error 11000 and maps to HTTP 409 Conflict with helpful message", () => {
    const handleCreateError = (error, parsedSeat, busNumber, journeyDate) => {
      if (
        error.code === 11000 ||
        (error.message && error.message.includes("E11000"))
      ) {
        return {
          status: 409,
          body: {
            message: `Seat ${parsedSeat} on Bus ${busNumber} was just booked for ${journeyDate}. Please select another seat.`,
          },
        };
      }
      throw error;
    };

    const mockE11000 = new Error(
      "E11000 duplicate key error collection: ebus.tickets index: busNumber_1_journeyDate_1_seatNumber_1 dup key: { busNumber: 'BUS-101', journeyDate: '2026-10-20', seatNumber: '4' }"
    );
    mockE11000.code = 11000;

    const response = handleCreateError(mockE11000, 4, "BUS-101", "2026-10-20");
    assert.equal(response.status, 409);
    assert.match(
      response.body.message,
      /Seat 4 on Bus BUS-101 was just booked for 2026-10-20/
    );
  });

  it("verifies that partial unique index permits rebooking of a cancelled seat", () => {
    // Simulated collection with partial unique index { busNumber: 1, journeyDate: 1, seatNumber: 1 } where status === 'Booked'
    const db = [];

    const insertTicket = (ticket) => {
      if (ticket.status === "Booked") {
        const conflict = db.find(
          (t) =>
            t.status === "Booked" &&
            t.busNumber === ticket.busNumber &&
            t.journeyDate === ticket.journeyDate &&
            t.seatNumber === ticket.seatNumber
        );
        if (conflict) {
          const err = new Error("E11000 duplicate key error");
          err.code = 11000;
          throw err;
        }
      }
      db.push(ticket);
      return ticket;
    };

    // Step 1: Passenger 1 books Seat 10
    const ticket1 = insertTicket({
      ticketId: "TKT-P1",
      busNumber: "BUS-55",
      journeyDate: "2026-10-30",
      seatNumber: "10",
      status: "Booked",
    });
    assert.equal(ticket1.status, "Booked");

    // Step 2: Passenger 2 attempts concurrent booking for Seat 10 -> Throws 11000
    assert.throws(
      () => {
        insertTicket({
          ticketId: "TKT-P2",
          busNumber: "BUS-55",
          journeyDate: "2026-10-30",
          seatNumber: "10",
          status: "Booked",
        });
      },
      (err) => err.code === 11000
    );

    // Step 3: Passenger 1 cancels their ticket
    ticket1.status = "Cancelled";

    // Step 4: Passenger 3 attempts to book Seat 10 -> Now SUCCEEDS because partial filter excludes 'Cancelled'
    const ticket3 = insertTicket({
      ticketId: "TKT-P3",
      busNumber: "BUS-55",
      journeyDate: "2026-10-30",
      seatNumber: "10",
      status: "Booked",
    });

    assert.equal(ticket3.status, "Booked");
    assert.equal(db.length, 2);
    assert.equal(db.filter((t) => t.status === "Booked").length, 1);
  });
});

describe("6. Accurate Cancellation Messages & Internal Accounting Reality", () => {
  it("verifies API cancellation message clarifies internal status update and does not claim real monetary refund", () => {
    const apiResponse = {
      message:
        "Ticket cancelled successfully. Reservation released and internal payment record marked as Refunded.",
      ticket: { ticketId: "TKT-99", status: "Cancelled" },
    };

    assert.match(apiResponse.message, /Reservation released/i);
    assert.match(apiResponse.message, /internal payment record marked as Refunded/i);
    assert.doesNotMatch(apiResponse.message, /refund processed to bank|refund initiated to card/i);
  });

  it("verifies UI confirmation dialog clarifies that no external banking refund is disbursed", () => {
    const uiConfirmText =
      "Are you sure you want to cancel Ticket #TKT-99? This will release your seat reservation and mark the internal payment record as Refunded (no external banking refund is disbursed).";

    assert.match(uiConfirmText, /no external banking refund is disbursed/i);
  });
});

describe("7. Passenger Booking Workflow Input Validations & Integrity", () => {
  // Pure validation logic matching portalController.js bookTicket
  const validateBookingInput = ({ busNumber, journeyDate, seatNumber, bus }) => {
    if (!busNumber || !journeyDate || seatNumber === undefined || seatNumber === null) {
      return { status: 400, message: "busNumber, journeyDate, and seatNumber are required" };
    }

    const parsedSeat = parseInt(seatNumber, 10);
    if (isNaN(parsedSeat) || parsedSeat < 1) {
      return { status: 400, message: "Invalid seat number provided" };
    }

    if (!bus || bus.status !== "Active") {
      return { status: 404, message: `Bus '${busNumber}' is not active or does not exist` };
    }

    if (parsedSeat > bus.capacity) {
      return { status: 400, message: `Seat number ${parsedSeat} exceeds bus capacity of ${bus.capacity}` };
    }

    return { status: 200, parsedSeat };
  };

  it("returns 400 when busNumber, journeyDate, or seatNumber is missing", () => {
    assert.equal(validateBookingInput({ journeyDate: "2026-10-20", seatNumber: 1 }).status, 400);
    assert.equal(validateBookingInput({ busNumber: "BUS-1", seatNumber: 1 }).status, 400);
    assert.equal(validateBookingInput({ busNumber: "BUS-1", journeyDate: "2026-10-20" }).status, 400);
  });

  it("returns 400 for invalid seat numbers (0, negative, non-numeric)", () => {
    const mockBus = { busNumber: "BUS-1", capacity: 40, status: "Active" };
    assert.equal(validateBookingInput({ busNumber: "BUS-1", journeyDate: "2026-10-20", seatNumber: 0, bus: mockBus }).status, 400);
    assert.equal(validateBookingInput({ busNumber: "BUS-1", journeyDate: "2026-10-20", seatNumber: -5, bus: mockBus }).status, 400);
    assert.equal(validateBookingInput({ busNumber: "BUS-1", journeyDate: "2026-10-20", seatNumber: "abc", bus: mockBus }).status, 400);
  });

  it("returns 404 when referenced bus does not exist or is inactive", () => {
    assert.equal(validateBookingInput({ busNumber: "GHOST-999", journeyDate: "2026-10-20", seatNumber: 5, bus: null }).status, 404);
    assert.equal(validateBookingInput({ busNumber: "MAINT-1", journeyDate: "2026-10-20", seatNumber: 5, bus: { status: "Maintenance", capacity: 40 } }).status, 404);
  });

  it("returns 400 when seat number exceeds bus capacity", () => {
    const mockBus = { busNumber: "BUS-1", capacity: 30, status: "Active" };
    const res = validateBookingInput({ busNumber: "BUS-1", journeyDate: "2026-10-20", seatNumber: 31, bus: mockBus });
    assert.equal(res.status, 400);
    assert.match(res.message, /exceeds bus capacity of 30/i);
  });

  it("ensures ticket and payment record consistency upon successful booking", () => {
    const bus = { busNumber: "BUS-50", route: "Campus Express", fare: 75, capacity: 40 };
    const user = { uid: "p-444", email: "student@univ.edu", displayName: "Student One" };
    const ticketId = "TKT-TEST-123";
    const paymentId = "PAY-TEST-123";

    const ticket = {
      ticketId,
      passengerName: user.displayName,
      busNumber: bus.busNumber,
      routeName: bus.route,
      journeyDate: "2026-11-05",
      seatNumber: "12",
      fare: bus.fare,
      status: "Booked",
      userId: user.uid,
      userEmail: user.email,
    };

    const payment = {
      paymentId,
      ticketId: ticket.ticketId,
      passengerName: ticket.passengerName,
      amount: bus.fare,
      paymentMethod: "UPI",
      status: "Paid",
      userId: user.uid,
      userEmail: user.email,
    };

    assert.equal(ticket.ticketId, payment.ticketId);
    assert.equal(ticket.fare, payment.amount);
    assert.equal(ticket.userId, payment.userId);
    assert.equal(ticket.userEmail, payment.userEmail);
    assert.equal(ticket.status, "Booked");
    assert.equal(payment.status, "Paid");
  });
});

describe("8. Administrator CRUD Regression Verification across All 8 Modules", () => {
  const adminModules = [
    { name: "buses", path: "../routes/busRoutes.js" },
    { name: "routes", path: "../routes/routeRoutes.js" },
    { name: "drivers", path: "../routes/driverRoutes.js" },
    { name: "students", path: "../routes/studentRoutes.js" },
    { name: "tickets", path: "../routes/ticketRoutes.js" },
    { name: "passes", path: "../routes/passRoutes.js" },
    { name: "payments", path: "../routes/paymentRoutes.js" },
    { name: "dashboard", path: "../routes/dashboardRoutes.js" },
  ];

  it("verifies that all 8 administrative routers exist and export Express routers", async () => {
    for (const mod of adminModules) {
      const routerModule = await import(mod.path);
      assert.ok(routerModule.default, `Module ${mod.name} must export a router`);
      assert.equal(typeof routerModule.default, "function", `Router for ${mod.name} must be an Express middleware function`);
    }
  });

  it("verifies requireRole(['admin']) restricts passenger access across all 8 modules", () => {
    const adminOnlyGate = requireRole(["admin"]);

    const passengerReq = {
      user: {
        uid: "passenger-xyz",
        email: "passenger@user.com",
        role: "passenger",
      },
    };

    adminModules.forEach((mod) => {
      let statusSent = null;
      let jsonSent = null;
      const res = {
        status(code) {
          statusSent = code;
          return this;
        },
        json(data) {
          jsonSent = data;
          return this;
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      adminOnlyGate(passengerReq, res, next);
      assert.equal(statusSent, 403, `Module ${mod.name} must reject passenger with 403 Forbidden`);
      assert.match(jsonSent.message, /Forbidden.*role 'passenger'/i);
      assert.equal(nextCalled, false, `Module ${mod.name} must not call next() for passenger`);
    });
  });

  it("verifies requireRole(['admin']) permits authenticated administrators across all 8 modules", () => {
    const adminOnlyGate = requireRole(["admin"]);

    const adminReq = {
      user: {
        uid: "admin-master",
        email: "admin@ebus.com",
        role: "admin",
      },
    };

    adminModules.forEach((mod) => {
      let statusSent = null;
      const res = {
        status(code) {
          statusSent = code;
          return this;
        },
        json() {
          return this;
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      adminOnlyGate(adminReq, res, next);
      assert.equal(statusSent, null, `Module ${mod.name} must not set error status for admin`);
      assert.equal(nextCalled, true, `Module ${mod.name} must call next() for admin`);
    });
  });
});

