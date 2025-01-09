export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  joinDate: string;
  leaseEnd: string;
  preferences?: {
    roomType: string;
    maxRent: number;
    floor?: string;
  };
  documents?: {
    id: string;
    type: string;
    url: string;
  }[];
}

export interface Room {
  id: string;
  number: string;
  type: string;
  capacity: string;
  price: string;
  status: "available" | "occupied" | "maintenance";
  floor: string;
  building?: string;
  currentOccupancy?: number;
  amenities?: string[];
  currentTenants?: string[];
}

export interface RoomAllocation {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  duration: string;
  status: "active" | "upcoming" | "ended";
}