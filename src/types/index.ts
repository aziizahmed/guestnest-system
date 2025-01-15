export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergency_contact: string; // Changed from emergencyContact
  join_date: string; // Changed from joinDate
  lease_end: string; // Changed from leaseEnd
  room_id?: string;
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
  room?: {
    number: string;
    building: string;
    floor: string;
  };
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
  current_occupancy?: number;
  amenities?: string[];
  hostel_id?: string;
}

export interface Hostel {
  id: string;
  name: string;
  address: string;
  total_rooms: number; // Changed from totalRooms
  total_floors: number; // Changed from totalFloors
  buildings: string[];
  amenities: string[];
  status: 'active' | 'maintenance';
  occupied_rooms?: number;
  warden_name: string; // Changed from nested warden object
  warden_contact: string;
  warden_email?: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: string;
  notes?: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}