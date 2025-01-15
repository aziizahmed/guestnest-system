import { Json } from "@/integrations/supabase/types";

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergency_contact: string;
  join_date: string;
  lease_end: string;
  room_id?: string | null;
  preferences: {
    roomType: string;
    maxRent: number;
    floor?: string;
  };
  documents: Json[] | null;
  created_at: string;
  updated_at: string;
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
  status: 'available' | 'occupied' | 'maintenance';
  floor: string;
  building: string;
  current_occupancy: number | null;
  amenities: string[] | null;
  hostel_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Hostel {
  id: string;
  name: string;
  address: string;
  total_rooms: number;
  total_floors: number;
  buildings: string[];
  amenities: string[];
  status: 'active' | 'maintenance';
  warden_name: string;
  warden_contact: string;
  warden_email: string | null;
  occupied_rooms: number | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  category: string;
  sub_category: string;
  amount: number;
  date: string;
  payment_mode: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoomAllocation {
  id: string;
  room_id: string;
  tenant_id: string;
  start_date: string;
  duration: number;
  status: 'active' | 'upcoming' | 'expired';
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}