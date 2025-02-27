import { Room, Tenant, Hostel } from "@/types";

export const dummyRooms: Room[] = [
  {
    id: "101",
    number: "101",
    type: "single",
    capacity: "1",
    price: "5000",
    status: "available",
    floor: "1",
    building: "A",
    current_occupancy: 0,
    amenities: ["AC", "Attached Bathroom", "Study Table"],
    hostel_id: null,
    photo: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "102",
    number: "102",
    type: "double",
    capacity: "2",
    price: "8000",
    status: "occupied",
    floor: "1",
    building: "A",
    current_occupancy: 2,
    amenities: ["AC", "Attached Bathroom", "Study Table", "Balcony"],
    hostel_id: null,
    photo: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "201",
    number: "201",
    type: "single",
    capacity: "1",
    price: "5500",
    status: "maintenance",
    floor: "2",
    building: "A",
    current_occupancy: 0,
    amenities: ["AC", "Shared Bathroom", "Study Table"],
    hostel_id: null,
    photo: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyTenants: Tenant[] = [
  {
    id: "T1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    emergency_contact: "+1987654321",
    join_date: "2024-01-15",
    lease_end: "2024-12-31",
    room_id: "102",
    preferences: {
      roomType: "single",
      maxRent: 6000,
      floor: "1"
    },
    documents: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    room: {
      number: "102",
      building: "A",
      floor: "1"
    }
  },
  {
    id: "T2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    emergency_contact: "+1987654322",
    join_date: "2024-02-01",
    lease_end: "2024-12-31",
    room_id: "102",
    preferences: {
      roomType: "double",
      maxRent: 8000,
      floor: "1"
    },
    documents: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    room: {
      number: "102",
      building: "A",
      floor: "1"
    }
  },
  {
    id: "T3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1234567892",
    emergency_contact: "+1987654323",
    join_date: "2024-02-15",
    lease_end: "2024-12-31",
    room_id: null,
    preferences: {
      roomType: "single",
      maxRent: 5500,
      floor: "2"
    },
    documents: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dummyHostels: Hostel[] = [
  {
    id: "H1",
    name: "Sunshine Hostel",
    address: "123 Main Street",
    total_floors: 4,
    buildings: ["A", "B"],
    amenities: ["WiFi", "Gym", "Laundry"],
    status: "active",
    warden_name: "John Smith",
    warden_contact: "+1234567890",
    warden_email: "john@example.com",
    occupied_rooms: 35,
    photo: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "H2",
    name: "Moonlight Hostel",
    address: "456 Park Avenue",
    total_floors: 3,
    buildings: ["A"],
    amenities: ["WiFi", "Study Room"],
    status: "maintenance",
    warden_name: "Jane Doe",
    warden_contact: "+1234567891",
    warden_email: "jane@example.com",
    occupied_rooms: 0,
    photo: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
