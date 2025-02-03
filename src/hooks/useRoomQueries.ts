import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { RoomFilterState, AvailableRoom, RoomAvailabilityInfo } from "@/types/roomAllocation";

export const useRoomQueries = (filters: RoomFilterState) => {
  const { hostelId, floor } = filters;

  const isEnabled = Boolean(hostelId && floor);

  const checkRoomAvailability = (room: Room): RoomAvailabilityInfo => {
    const currentOccupancy = room.current_occupancy || 0;
    const capacity = parseInt(room.capacity);
    const isAvailable = room.status === 'available';
    const hasSpace = currentOccupancy < capacity;

    return {
      status: room.status,
      currentOccupancy,
      capacity,
      isAvailable,
      hasSpace
    };
  };

  return useQuery({
    queryKey: ['available-rooms', hostelId, floor],
    enabled: isEnabled,
    queryFn: async () => {
      console.log('Fetching rooms for hostel:', hostelId, 'and floor:', floor);
      
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', hostelId)
        .eq('floor', floor);

      if (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }

      console.log('All fetched rooms:', rooms);

      const availableRooms = rooms
        .map((room) => {
          const availability = checkRoomAvailability(room);
          console.log(`Room ${room.number} availability:`, availability);

          return {
            id: room.id,
            number: room.number,
            current_occupancy: room.current_occupancy,
            capacity: room.capacity,
            ...availability
          };
        })
        .filter((room) => room.isAvailable && room.hasSpace);

      console.log('Available rooms after filtering:', availableRooms);
      return availableRooms as AvailableRoom[];
    }
  });
};