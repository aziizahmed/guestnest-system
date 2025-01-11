export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  joinDate: string;
  leaseEnd: string;
  roomNumber?: string;
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

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'cash' | 'bank_transfer' | 'upi';
  notes?: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

export interface Hostel {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  totalFloors: number;
  buildings: string[];
  amenities: string[];
  status: 'active' | 'maintenance';
  warden: {
    name: string;
    contact: string;
  };
}
