import { Room } from "@/types";

export interface RoomFilterState {
  hostelId: string;
  floor: string;
}

export interface AvailableRoom extends Pick<Room, 'id' | 'number' | 'current_occupancy' | 'capacity'> {
  isAvailable: boolean;
  hasSpace: boolean;
}

export interface RoomAvailabilityInfo {
  status: string;
  currentOccupancy: number;
  capacity: number;
  isAvailable: boolean;
  hasSpace: boolean;
}