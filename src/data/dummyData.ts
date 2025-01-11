import { Room, Tenant } from "@/types";

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
    currentOccupancy: 0,
    amenities: ["AC", "Attached Bathroom", "Study Table"],
    currentTenants: []
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
    currentOccupancy: 2,
    amenities: ["AC", "Attached Bathroom", "Study Table", "Balcony"],
    currentTenants: ["T1", "T2"]
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
    currentOccupancy: 0,
    amenities: ["AC", "Shared Bathroom", "Study Table"],
    currentTenants: []
  }
];

export const dummyTenants: Tenant[] = [
  {
    id: "T1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    emergencyContact: "+1987654321",
    joinDate: "2024-01-15",
    leaseEnd: "2024-12-31",
    roomNumber: "102",
    preferences: {
      roomType: "single",
      maxRent: 6000,
      floor: "1"
    }
  },
  {
    id: "T2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    emergencyContact: "+1987654322",
    joinDate: "2024-02-01",
    leaseEnd: "2024-12-31",
    roomNumber: "102",
    preferences: {
      roomType: "double",
      maxRent: 8000,
      floor: "1"
    }
  },
  {
    id: "T3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1234567892",
    emergencyContact: "+1987654323",
    joinDate: "2024-02-15",
    leaseEnd: "2024-12-31",
    preferences: {
      roomType: "single",
      maxRent: 5500,
      floor: "2"
    }
  }
];