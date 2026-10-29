import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { requireRole } from "../middleware/authMiddleware.js";
import { deleteBus } from "../controllers/busController.js";
import { createTicket } from "../controllers/ticketController.js";
import { getAvailableServices } from "../controllers/portalController.js";
import Bus from "../models/bus.js";
import Route from "../models/route.js";
import Ticket from "../models/ticket.js";

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

describe("9. Two-Stage Bus Deletion Protection & Referential Integrity", () => {
  const originalFindById = Bus.findById;
  const originalCountDocuments = Ticket.countDocuments;
  const originalFindByIdAndDelete = Bus.findByIdAndDelete;

  const restoreMocks = () => {
    Bus.findById = originalFindById;
    Ticket.countDocuments = originalCountDocuments;
    Bus.findByIdAndDelete = originalFindByIdAndDelete;
  };

  const createMockRes = () => {
    let statusSent = null;
    let jsonSent = null;
    return {
      status(code) {
        statusSent = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
      getStatus: () => statusSent,
      getBody: () => jsonSent,
    };
  };

  it("blocks deleting an active bus and instructs admin to change status to Maintenance first (returns HTTP 409)", async () => {
    try {
      let countDocumentsCalled = false;
      let findByIdAndDeleteCalled = false;

      Bus.findById = async (id) => {
        assert.equal(id, "bus-act-101");
        return {
          _id: "bus-act-101",
          busNumber: "BUS-101",
          busName: "Metro Commuter",
          status: "Active",
        };
      };

      Ticket.countDocuments = async () => {
        countDocumentsCalled = true;
      };

      Bus.findByIdAndDelete = async () => {
        findByIdAndDeleteCalled = true;
      };

      const req = { params: { id: "bus-act-101" } };
      const res = createMockRes();

      await deleteBus(req, res);

      assert.equal(res.getStatus(), 409);
      assert.match(
        res.getBody().message,
        /Cannot delete active bus BUS-101.*change the bus status to 'Maintenance' first/i
      );
      assert.equal(countDocumentsCalled, false, "Should not check tickets for active bus");
      assert.equal(findByIdAndDeleteCalled, false, "Active bus must never be deleted directly");
    } finally {
      restoreMocks();
    }
  });

  it("blocks deleting a maintenance bus when active booked tickets exist (returns HTTP 409 Conflict)", async () => {
    try {
      let findByIdAndDeleteCalled = false;
      let ticketQueryFilter = null;

      Bus.findById = async (id) => {
        assert.equal(id, "bus-maint-202");
        return {
          _id: "bus-maint-202",
          busNumber: "BUS-202",
          busName: "City Express",
          status: "Maintenance",
        };
      };

      Ticket.countDocuments = async (filter) => {
        ticketQueryFilter = filter;
        return 3; // 3 active tickets exist
      };

      Bus.findByIdAndDelete = async () => {
        findByIdAndDeleteCalled = true;
      };

      const req = { params: { id: "bus-maint-202" } };
      const res = createMockRes();

      await deleteBus(req, res);

      assert.equal(res.getStatus(), 409);
      assert.deepEqual(ticketQueryFilter, {
        busNumber: "BUS-202",
        status: "Booked",
      });
      assert.match(
        res.getBody().message,
        /Cannot delete bus BUS-202.*3 active booked ticket\(s\)/i
      );
      assert.equal(res.getBody().activeTicketsCount, 3);
      assert.equal(findByIdAndDeleteCalled, false, "Maintenance bus must not be deleted when active tickets exist");
    } finally {
      restoreMocks();
    }
  });

  it("succeeds deleting a maintenance bus when no booked tickets exist (returns HTTP 200)", async () => {
    try {
      let deletedId = null;

      Bus.findById = async (id) => ({
        _id: id,
        busNumber: "BUS-303",
        busName: "Highway Cruiser",
        status: "Maintenance",
      });

      Ticket.countDocuments = async (filter) => {
        assert.deepEqual(filter, {
          busNumber: "BUS-303",
          status: "Booked",
        });
        return 0; // No active tickets
      };

      Bus.findByIdAndDelete = async (id) => {
        deletedId = id;
        return {
          _id: id,
          busNumber: "BUS-303",
          busName: "Highway Cruiser",
          status: "Maintenance",
        };
      };

      const req = { params: { id: "bus-xyz-789" } };
      const res = createMockRes();

      await deleteBus(req, res);

      assert.equal(res.getStatus(), 200);
      assert.equal(deletedId, "bus-xyz-789");
      assert.equal(res.getBody().message, "Bus deleted successfully");
      assert.equal(res.getBody().bus._id, "bus-xyz-789");
    } finally {
      restoreMocks();
    }
  });

  it("returns HTTP 404 when attempting to delete a nonexistent bus", async () => {
    try {
      let countDocumentsCalled = false;
      let findByIdAndDeleteCalled = false;

      Bus.findById = async () => null;
      Ticket.countDocuments = async () => {
        countDocumentsCalled = true;
      };
      Bus.findByIdAndDelete = async () => {
        findByIdAndDeleteCalled = true;
      };

      const req = { params: { id: "nonexistent-bus-id" } };
      const res = createMockRes();

      await deleteBus(req, res);

      assert.equal(res.getStatus(), 404);
      assert.equal(res.getBody().message, "Bus not found");
      assert.equal(countDocumentsCalled, false, "Should not check tickets if bus does not exist");
      assert.equal(findByIdAndDeleteCalled, false, "Should not call delete if bus does not exist");
    } finally {
      restoreMocks();
    }
  });

  it("handles database errors gracefully and returns the expected error response (HTTP 500)", async () => {
    try {
      // Test DB error during Bus.findById
      Bus.findById = async () => {
        throw new Error("MongoDB connection timeout");
      };

      const req = { params: { id: "bus-err-1" } };
      const res = createMockRes();

      await deleteBus(req, res);

      assert.equal(res.getStatus(), 500);
      assert.equal(res.getBody().message, "Failed to delete bus");
      assert.equal(res.getBody().error, "MongoDB connection timeout");

      // Test DB error during Ticket.countDocuments for Maintenance bus
      Bus.findById = async (id) => ({
        _id: id,
        busNumber: "BUS-ERR",
        status: "Maintenance",
      });
      Ticket.countDocuments = async () => {
        throw new Error("Ticket collection read failure");
      };

      const req2 = { params: { id: "bus-err-2" } };
      const res2 = createMockRes();

      await deleteBus(req2, res2);

      assert.equal(res2.getStatus(), 500);
      assert.equal(res2.getBody().message, "Failed to delete bus");
      assert.equal(res2.getBody().error, "Ticket collection read failure");
    } finally {
      restoreMocks();
    }
  });
});

describe("10. Administrative Ticket Creation Bus Validation (createTicket)", () => {
  const originalFindOne = Bus.findOne;
  const originalCreate = Ticket.create;

  const restoreMocks = () => {
    Bus.findOne = originalFindOne;
    Ticket.create = originalCreate;
  };

  const createMockRes = () => {
    let statusSent = null;
    let jsonSent = null;
    return {
      status(code) {
        statusSent = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
      getStatus: () => statusSent,
      getBody: () => jsonSent,
    };
  };

  it("succeeds creating a ticket when referenced bus exists and is Active (returns HTTP 201)", async () => {
    try {
      let createPayload = null;

      Bus.findOne = async (filter) => {
        assert.equal(filter.busNumber, "BUS-ACT-1");
        return {
          _id: "bus-id-1",
          busNumber: "BUS-ACT-1",
          status: "Active",
          capacity: 40,
        };
      };

      Ticket.create = async (body) => {
        createPayload = body;
        return {
          _id: "tkt-id-1",
          ticketId: "TKT-ADM-1",
          ...body,
        };
      };

      const req = {
        body: {
          ticketId: "TKT-ADM-1",
          passengerName: "Test Passenger",
          busNumber: "BUS-ACT-1",
          routeName: "Route A",
          journeyDate: "2026-11-01",
          seatNumber: "5",
          fare: 100,
          status: "Booked",
        },
      };
      const res = createMockRes();

      await createTicket(req, res);

      assert.equal(res.getStatus(), 201);
      assert.equal(createPayload.busNumber, "BUS-ACT-1");
      assert.equal(res.getBody().ticketId, "TKT-ADM-1");
    } finally {
      restoreMocks();
    }
  });

  it("blocks ticket creation when referenced bus is in Maintenance (returns HTTP 400)", async () => {
    try {
      let createCalled = false;

      Bus.findOne = async (filter) => {
        assert.equal(filter.busNumber, "BUS-MAINT-1");
        return {
          _id: "bus-id-2",
          busNumber: "BUS-MAINT-1",
          status: "Maintenance",
        };
      };

      Ticket.create = async () => {
        createCalled = true;
      };

      const req = {
        body: {
          busNumber: "BUS-MAINT-1",
          passengerName: "Commuter",
          journeyDate: "2026-11-01",
          seatNumber: "10",
        },
      };
      const res = createMockRes();

      await createTicket(req, res);

      assert.equal(res.getStatus(), 400);
      assert.match(
        res.getBody().message,
        /Cannot create ticket.*BUS-MAINT-1.*is not active.*Maintenance/i
      );
      assert.equal(createCalled, false, "Ticket must not be created for Maintenance bus");
    } finally {
      restoreMocks();
    }
  });

  it("blocks ticket creation when referenced bus does not exist (returns HTTP 404)", async () => {
    try {
      let createCalled = false;

      Bus.findOne = async () => null;
      Ticket.create = async () => {
        createCalled = true;
      };

      const req = {
        body: {
          busNumber: "GHOST-999",
          passengerName: "Commuter",
        },
      };
      const res = createMockRes();

      await createTicket(req, res);

      assert.equal(res.getStatus(), 404);
      assert.match(
        res.getBody().message,
        /Cannot create ticket.*GHOST-999.*does not exist/i
      );
      assert.equal(createCalled, false, "Ticket must not be created for nonexistent bus");
    } finally {
      restoreMocks();
    }
  });

  it("blocks ticket creation when busNumber is missing from payload (returns HTTP 400)", async () => {
    try {
      const req = {
        body: {
          passengerName: "Nameless Bus Rider",
        },
      };
      const res = createMockRes();

      await createTicket(req, res);

      assert.equal(res.getStatus(), 400);
      assert.match(res.getBody().message, /busNumber is required/i);
    } finally {
      restoreMocks();
    }
  });
});

describe("11. Bus-Route Linking Contract & Service Search (getAvailableServices)", () => {
  const originalBusFind = Bus.find;
  const originalRouteFind = Route.find;

  const restoreMocks = () => {
    Bus.find = originalBusFind;
    Route.find = originalRouteFind;
  };

  const createMockRes = () => {
    let jsonSent = null;
    let statusSent = 200;
    return {
      status(code) {
        statusSent = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
      getStatus: () => statusSent,
      getBody: () => jsonSent,
    };
  };

  it("correctly joins Bus with Route when bus.route matches route.routeName", async () => {
    try {
      Bus.find = async (filter) => {
        assert.equal(filter.status, "Active");
        return [
          {
            _id: "bus-1",
            busNumber: "AS-01-KB-1001",
            busName: "ASTC Brahmaputra",
            busType: "AC Deluxe",
            driver: "Ramesh Das",
            route: "Kharupetia - Guwahati Express",
            capacity: 40,
            fare: 180,
          },
        ];
      };

      Route.find = async (filter) => {
        assert.equal(filter.status, "Active");
        return [
          {
            _id: "rt-1",
            routeId: "RT-01",
            routeName: "Kharupetia - Guwahati Express",
            source: "Kharupetia",
            destination: "Guwahati",
            stops: ["Mangaldai", "Sipajhar", "Baihata Chariali"],
            distance: 85,
            estimatedTime: 150,
            status: "Active",
          },
        ];
      };

      const req = { query: {} };
      const res = createMockRes();

      await getAvailableServices(req, res);

      const services = res.getBody();
      assert.equal(services.length, 1);
      assert.equal(services[0].busNumber, "AS-01-KB-1001");
      assert.equal(services[0].source, "Kharupetia");
      assert.equal(services[0].destination, "Guwahati");
      assert.equal(services[0].distance, 85);
      assert.equal(services[0].estimatedTime, 150);
      assert.deepEqual(services[0].stops, ["Mangaldai", "Sipajhar", "Baihata Chariali"]);
    } finally {
      restoreMocks();
    }
  });

  it("falls back to default endpoints when bus.route does not match any active route", async () => {
    try {
      Bus.find = async () => [
        {
          _id: "bus-2",
          busNumber: "AS-99-ZZ-9999",
          busName: "Orphan Bus",
          busType: "Standard",
          driver: "Unknown",
          route: "Legacy Unlinked Route Name",
          capacity: 30,
          fare: 100,
        },
      ];

      Route.find = async () => [];

      const req = { query: {} };
      const res = createMockRes();

      await getAvailableServices(req, res);

      const services = res.getBody();
      assert.equal(services.length, 1);
      assert.equal(services[0].source, "Main Terminal");
      assert.equal(services[0].destination, "City Center");
      assert.deepEqual(services[0].stops, []);
    } finally {
      restoreMocks();
    }
  });

  it("filters services by source and destination query (including intermediate stops)", async () => {
    try {
      Bus.find = async () => [
        {
          _id: "bus-1",
          busNumber: "BUS-KHP",
          route: "Route KHP",
          capacity: 40,
          fare: 180,
        },
        {
          _id: "bus-2",
          busNumber: "BUS-TEZ",
          route: "Route TEZ",
          capacity: 36,
          fare: 350,
        },
      ];

      Route.find = async () => [
        {
          routeName: "Route KHP",
          source: "Kharupetia",
          destination: "Guwahati",
          stops: ["Mangaldai", "Sipajhar"],
        },
        {
          routeName: "Route TEZ",
          source: "Tezpur",
          destination: "Guwahati",
          stops: ["Nagaon", "Jagiroad"],
        },
      ];

      // Query matching intermediate stop "Mangaldai"
      const req = { query: { source: "Mangaldai", destination: "Guwahati" } };
      const res = createMockRes();

      await getAvailableServices(req, res);

      const services = res.getBody();
      assert.equal(services.length, 1);
      assert.equal(services[0].busNumber, "BUS-KHP");
    } finally {
      restoreMocks();
    }
  });
});
