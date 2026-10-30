// High-fidelity Transit Corridor & E-Bus Fleet Dataset
// Built for reliable demonstrations, offline fail-safe, and viva presentations.

export const DEFAULT_TRANSIT_SERVICES = [
  {
    _id: "demo-bus-101",
    busNumber: "AS-01-KB-1001",
    busName: "ASTC Brahmaputra Deluxe",
    busType: "AC Electric Deluxe",
    isEV: true,
    driver: "Ramesh Das",
    routeName: "Kharupetia - Guwahati Express",
    source: "Kharupetia",
    destination: "Guwahati",
    departureTime: "07:00 AM",
    arrivalTime: "09:30 AM",
    duration: "2h 30m",
    schedule: "Daily Morning Express",
    capacity: 40,
    fare: 180,
    distance: 85,
    estimatedTime: 150,
    stops: ["Mangaldai", "Sipajhar", "Baihata Chariali", "Jalukbari"],
    amenities: ["⚡ EV Eco-Friendly", "❄️ AC", "🔌 USB Charging", "📍 Live GPS"],
    statusBadge: "On Schedule",
    seatsAvailable: 28,
  },
  {
    _id: "demo-bus-102",
    busNumber: "AS-01-KB-1002",
    busName: "Darrang Highway Coach",
    busType: "Standard Express",
    isEV: false,
    driver: "Biren Kalita",
    routeName: "Kharupetia - Guwahati Express",
    source: "Kharupetia",
    destination: "Guwahati",
    departureTime: "11:30 AM",
    arrivalTime: "02:00 PM",
    duration: "2h 30m",
    schedule: "Daily Midday Express",
    capacity: 36,
    fare: 140,
    distance: 85,
    estimatedTime: 150,
    stops: ["Mangaldai", "Sipajhar", "Baihata Chariali", "Jalukbari"],
    amenities: ["❄️ Air Cooled", "🪑 Pushback Seats", "📍 GPS Tracked"],
    statusBadge: "On Schedule",
    seatsAvailable: 22,
  },
  {
    _id: "demo-bus-201",
    busNumber: "AS-01-GK-2001",
    busName: "Green Valley Commuter",
    busType: "AC Electric Deluxe",
    isEV: true,
    driver: "Pranjal Barman",
    routeName: "Guwahati - Kharupetia Return",
    source: "Guwahati",
    destination: "Kharupetia",
    departureTime: "04:30 PM",
    arrivalTime: "07:00 PM",
    duration: "2h 30m",
    schedule: "Daily Evening Return",
    capacity: 40,
    fare: 180,
    distance: 85,
    estimatedTime: 150,
    stops: ["Jalukbari", "Baihata Chariali", "Sipajhar", "Mangaldai"],
    amenities: ["⚡ EV Eco-Friendly", "❄️ AC", "🔌 USB Charging", "📍 Live GPS"],
    statusBadge: "Boarding Soon",
    seatsAvailable: 19,
  },
  {
    _id: "demo-bus-301",
    busNumber: "AS-12-TG-3001",
    busName: "Agnigarh Highway Star",
    busType: "Volvo Multi-Axle EV",
    isEV: true,
    driver: "Mukesh Goswami",
    routeName: "Tezpur - Guwahati Deluxe",
    source: "Tezpur",
    destination: "Guwahati",
    departureTime: "06:15 AM",
    arrivalTime: "10:15 AM",
    duration: "4h 00m",
    schedule: "Daily Superfast",
    capacity: 44,
    fare: 320,
    distance: 180,
    estimatedTime: 240,
    stops: ["Kaliabor", "Nagaon Bypass", "Jagiroad", "Khanapara"],
    amenities: ["⚡ 100% Electric", "❄️ Climate Control", "📶 Free Wi-Fi", "🔌 USB Port"],
    statusBadge: "On Schedule",
    seatsAvailable: 31,
  },
  {
    _id: "demo-bus-302",
    busNumber: "AS-12-GT-3002",
    busName: "Sonitpur Royal Cruiser",
    busType: "AC Sleeper & Seater",
    isEV: false,
    driver: "Deben Hazarika",
    routeName: "Guwahati - Tezpur Deluxe",
    source: "Guwahati",
    destination: "Tezpur",
    departureTime: "02:00 PM",
    arrivalTime: "06:00 PM",
    duration: "4h 00m",
    schedule: "Daily Afternoon Service",
    capacity: 32,
    fare: 350,
    distance: 180,
    estimatedTime: 240,
    stops: ["Khanapara", "Jagiroad", "Nagaon Bypass", "Kaliabor"],
    amenities: ["❄️ AC Sleeper", "🪑 Recliner", "📍 GPS Tracked", "💧 Water Bottle"],
    statusBadge: "On Schedule",
    seatsAvailable: 15,
  },
  {
    _id: "demo-bus-401",
    busNumber: "AS-11-SG-4001",
    busName: "Barak Valley Superfast",
    busType: "Super Luxury Coach",
    isEV: false,
    driver: "Anowar Hussain",
    routeName: "Silchar - Guwahati Superfast",
    source: "Silchar",
    destination: "Guwahati",
    departureTime: "08:00 PM",
    arrivalTime: "04:30 AM",
    duration: "8h 30m",
    schedule: "Daily Overnight Express",
    capacity: 36,
    fare: 550,
    distance: 310,
    estimatedTime: 480,
    stops: ["Badarpur", "Haflong", "Lumding", "Dispur"],
    amenities: ["❄️ AC Night Coach", "🛌 Reclining Sleeper", "🔌 Charging Points", "📍 GPS"],
    statusBadge: "Night Service",
    seatsAvailable: 12,
  },
  {
    _id: "demo-bus-501",
    busNumber: "AS-01-EV-5001",
    busName: "Green Corridor EV Shuttle",
    busType: "Zero-Emission Electric",
    isEV: true,
    driver: "Chandan Mahanta",
    routeName: "Guwahati - Shillong EV Express",
    source: "Guwahati",
    destination: "Shillong",
    departureTime: "08:30 AM",
    arrivalTime: "11:30 AM",
    duration: "3h 00m",
    schedule: "Daily Intercity EV",
    capacity: 30,
    fare: 250,
    distance: 100,
    estimatedTime: 180,
    stops: ["Khanapara", "Nongpoh", "Umiam Lake", "Police Bazar"],
    amenities: ["⚡ Zero Emission EV", "❄️ Air Purified AC", "🎧 Panoramic View", "🔌 Fast Charger"],
    statusBadge: "Eco Favorite",
    seatsAvailable: 24,
  },
];

export const POPULAR_CORRIDORS = [
  { label: "All Corridors", source: "", destination: "", icon: "🌐" },
  { label: "Kharupetia ➔ Guwahati", source: "Kharupetia", destination: "Guwahati", icon: "🚌" },
  { label: "Guwahati ➔ Kharupetia", source: "Guwahati", destination: "Kharupetia", icon: "🔄" },
  { label: "Tezpur ➔ Guwahati", source: "Tezpur", destination: "Guwahati", icon: "⭐" },
  { label: "Silchar ➔ Guwahati", source: "Silchar", destination: "Guwahati", icon: "🌙" },
  { label: "100% Electric EV", filterType: "EV", icon: "⚡" },
];

/**
 * Filter services array based on source, destination, and EV filter
 */
export function filterTransitServices(servicesList, source, destination, filterType) {
  const list = servicesList && servicesList.length > 0 ? servicesList : DEFAULT_TRANSIT_SERVICES;
  let results = [...list];

  if (filterType === "EV") {
    results = results.filter(
      (s) => s.isEV || (s.busType && s.busType.toLowerCase().includes("electric"))
    );
  }

  if (source && source.trim()) {
    const src = source.trim().toLowerCase();
    results = results.filter(
      (s) =>
        s.source?.toLowerCase().includes(src) ||
        (Array.isArray(s.stops) && s.stops.some((st) => st.toLowerCase().includes(src)))
    );
  }

  if (destination && destination.trim()) {
    const dest = destination.trim().toLowerCase();
    results = results.filter(
      (s) =>
        s.destination?.toLowerCase().includes(dest) ||
        (Array.isArray(s.stops) && s.stops.some((st) => st.toLowerCase().includes(dest)))
    );
  }

  return results;
}
