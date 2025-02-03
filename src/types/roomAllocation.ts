import { Room } from "@/types";

export interface RoomFilterState {
  hostelId: string;
  floor: string;
}

export interface AvailableRoom {
  id: string;
  number: string;
  current_occupancy: number | null;
  capacity: string;
  status: "available" | "occupied" | "maintenance";
  isAvailable: boolean;
  hasSpace: boolean;
}

export interface RoomAvailabilityInfo {
  status: "available" | "occupied" | "maintenance";
  currentOccupancy: number;
  capacity: number;
  isAvailable: boolean;
  hasSpace: boolean;
}