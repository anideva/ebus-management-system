import Route from "../models/route.js";
import Bus from "../models/bus.js";
import Driver from "../models/driver.js";
import Student from "../models/student.js";
import Pass from "../models/pass.js";

export const DEMO_ROUTES = [
  {
    routeId: "RT-01",
    routeName: "Kharupetia - Guwahati Express",
    source: "Kharupetia",
    destination: "Guwahati",
    stops: ["Mangaldai", "Sipajhar", "Baihata Chariali", "Jalukbari"],
    distance: 85,
    estimatedTime: 150,
    status: "Active",
  },
  {
    routeId: "RT-02",
    routeName: "Guwahati - Kharupetia Return",
    source: "Guwahati",
    destination: "Kharupetia",
    stops: ["Jalukbari", "Baihata Chariali", "Sipajhar", "Mangaldai"],
    distance: 85,
    estimatedTime: 150,
    status: "Active",
  },
  {
    routeId: "RT-03",
    routeName: "Tezpur - Guwahati Deluxe",
    source: "Tezpur",
    destination: "Guwahati",
    stops: ["Kaliabor", "Nagaon Bypass", "Jagiroad", "Khanapara"],
    distance: 180,
    estimatedTime: 240,
    status: "Active",
  },
  {
    routeId: "RT-04",
    routeName: "Guwahati - Tezpur Deluxe",
    source: "Guwahati",
    destination: "Tezpur",
    stops: ["Khanapara", "Jagiroad", "Nagaon Bypass", "Kaliabor"],
    distance: 180,
    estimatedTime: 240,
    status: "Active",
  },
  {
    routeId: "RT-05",
    routeName: "Silchar - Guwahati Superfast",
    source: "Silchar",
    destination: "Guwahati",
    stops: ["Badarpur", "Haflong", "Lumding", "Dispur"],
    distance: 310,
    estimatedTime: 480,
    status: "Active",
  },
];

export const DEMO_BUSES = [
  {
    busNumber: "AS-01-KB-1001",
    busName: "ASTC Brahmaputra Deluxe",
    busType: "AC Deluxe",
    driver: "Ramesh Das",
    route: "Kharupetia - Guwahati Express",
    capacity: 40,
    fare: 180,
    status: "Active",
  },
  {
    busNumber: "AS-01-KB-1002",
    busName: "Darrang Express Coach",
    busType: "Standard Express",
    driver: "Biren Kalita",
    route: "Kharupetia - Guwahati Express",
    capacity: 36,
    fare: 140,
    status: "Active",
  },
  {
    busNumber: "AS-01-GK-2001",
    busName: "Green Valley Commuter",
    busType: "AC Deluxe",
    driver: "Pranjal Barman",
    route: "Guwahati - Kharupetia Return",
    capacity: 40,
    fare: 180,
    status: "Active",
  },
  {
    busNumber: "AS-12-TG-3001",
    busName: "Agnigarh Highway Star",
    busType: "Volvo Multi-Axle",
    driver: "Mukesh Goswami",
    route: "Tezpur - Guwahati Deluxe",
    capacity: 44,
    fare: 320,
    status: "Active",
  },
  {
    busNumber: "AS-12-GT-3002",
    busName: "Sonitpur Royal Cruiser",
    busType: "AC Sleeper",
    driver: "Deben Hazarika",
    route: "Guwahati - Tezpur Deluxe",
    capacity: 32,
    fare: 350,
    status: "Active",
  },
  {
    busNumber: "AS-11-SG-4001",
    busName: "Barak Valley Express",
    busType: "Super Luxury Coach",
    driver: "Anowar Hussain",
    route: "Silchar - Guwahati Superfast",
    capacity: 36,
    fare: 550,
    status: "Active",
  },
];

export const DEMO_DRIVERS = [
  {
    driverId: "DRV-01",
    driverName: "Ramesh Das",
    contactNumber: "+91 98540 12345",
    experience: "8 Years",
    licenseNumber: "AS-01-2016-0045892",
    assignedBus: "AS-01-KB-1001",
    busType: "AC Deluxe",
    capacity: 40,
    status: "Active",
  },
  {
    driverId: "DRV-02",
    driverName: "Biren Kalita",
    contactNumber: "+91 98540 23456",
    experience: "12 Years",
    licenseNumber: "AS-01-2012-0091823",
    assignedBus: "AS-01-KB-1002",
    busType: "Standard Express",
    capacity: 36,
    status: "Active",
  },
  {
    driverId: "DRV-03",
    driverName: "Pranjal Barman",
    contactNumber: "+91 94350 34567",
    experience: "6 Years",
    licenseNumber: "AS-01-2018-0033104",
    assignedBus: "AS-01-GK-2001",
    busType: "AC Deluxe",
    capacity: 40,
    status: "Active",
  },
  {
    driverId: "DRV-04",
    driverName: "Mukesh Goswami",
    contactNumber: "+91 94351 45678",
    experience: "10 Years",
    licenseNumber: "AS-12-2014-0077219",
    assignedBus: "AS-12-TG-3001",
    busType: "Volvo Multi-Axle",
    capacity: 44,
    status: "Active",
  },
  {
    driverId: "DRV-05",
    driverName: "Deben Hazarika",
    contactNumber: "+91 97060 56789",
    experience: "15 Years",
    licenseNumber: "AS-12-2009-0012984",
    assignedBus: "AS-12-GT-3002",
    busType: "AC Sleeper",
    capacity: 32,
    status: "Active",
  },
  {
    driverId: "DRV-06",
    driverName: "Anowar Hussain",
    contactNumber: "+91 97061 67890",
    experience: "7 Years",
    licenseNumber: "AS-11-2017-0055431",
    assignedBus: "AS-11-SG-4001",
    busType: "Super Luxury Coach",
    capacity: 36,
    status: "Active",
  },
];

export const DEMO_STUDENTS = [
  {
    studentId: "STU-101",
    studentName: "Priyanka Saikia",
    studentClass: "B.Tech Computer Science",
    section: "Sem 5 - Section A",
    contactNumber: "+91 94350 56789",
    assignedRoute: "Kharupetia - Guwahati Express",
    assignedBus: "AS-01-KB-1001",
    status: "Active",
  },
  {
    studentId: "STU-102",
    studentName: "Arunav Das",
    studentClass: "B.Sc Physics",
    section: "Sem 3 - Section B",
    contactNumber: "+91 98540 67890",
    assignedRoute: "Kharupetia - Guwahati Express",
    assignedBus: "AS-01-KB-1002",
    status: "Active",
  },
  {
    studentId: "STU-103",
    studentName: "Monali Bora",
    studentClass: "MBA Finance",
    section: "Sem 1 - Section A",
    contactNumber: "+91 97060 78901",
    assignedRoute: "Tezpur - Guwahati Deluxe",
    assignedBus: "AS-12-TG-3001",
    status: "Active",
  },
  {
    studentId: "STU-104",
    studentName: "Deepak Nath",
    studentClass: "Higher Secondary",
    section: "12th Science",
    contactNumber: "+91 94351 89012",
    assignedRoute: "Guwahati - Tezpur Deluxe",
    assignedBus: "AS-12-GT-3002",
    status: "Active",
  },
];

export async function seedDemoDataService() {
  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextQuarter = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  const DEMO_PASSES = [
    {
      passId: "PASS-501",
      studentName: "Priyanka Saikia",
      studentId: "STU-101",
      busNumber: "AS-01-KB-1001",
      routeName: "Kharupetia - Guwahati Express",
      validFrom: now,
      validUntil: nextQuarter,
      passType: "Quarterly",
      status: "Active",
    },
    {
      passId: "PASS-502",
      studentName: "Arunav Das",
      studentId: "STU-102",
      busNumber: "AS-01-KB-1002",
      routeName: "Kharupetia - Guwahati Express",
      validFrom: now,
      validUntil: nextMonth,
      passType: "Monthly",
      status: "Active",
    },
    {
      passId: "PASS-503",
      studentName: "Monali Bora",
      studentId: "STU-103",
      busNumber: "AS-12-TG-3001",
      routeName: "Tezpur - Guwahati Deluxe",
      validFrom: now,
      validUntil: nextQuarter,
      passType: "Quarterly",
      status: "Active",
    },
  ];

  for (const r of DEMO_ROUTES) {
    await Route.findOneAndUpdate({ routeId: r.routeId }, r, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
  }

  for (const b of DEMO_BUSES) {
    await Bus.findOneAndUpdate({ busNumber: b.busNumber }, b, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
  }

  for (const d of DEMO_DRIVERS) {
    await Driver.findOneAndUpdate({ driverId: d.driverId }, d, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
  }

  for (const s of DEMO_STUDENTS) {
    await Student.findOneAndUpdate({ studentId: s.studentId }, s, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
  }

  for (const p of DEMO_PASSES) {
    await Pass.findOneAndUpdate({ passId: p.passId }, p, {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    });
  }

  return {
    routes: DEMO_ROUTES.length,
    buses: DEMO_BUSES.length,
    drivers: DEMO_DRIVERS.length,
    students: DEMO_STUDENTS.length,
    passes: DEMO_PASSES.length,
  };
}
