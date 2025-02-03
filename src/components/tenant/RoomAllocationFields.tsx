import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface RoomAllocationFieldsProps {
  form: UseFormReturn<any>;
}

export function RoomAllocationFields({ form }: RoomAllocationFieldsProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  // Fetch hostels
  const { data: hostels = [], isLoading: isLoadingHostels } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      console.log('Fetching hostels...');
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching hostels:', error);
        throw error;
      }
      console.log('Hostels fetched:', data);
      return data;
    },
  });

  // Fetch rooms based on selected hostel and floor
  const { data: rooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms', selectedHostel, selectedFloor],
    enabled: !!selectedHostel && !!selectedFloor,
    queryFn: async () => {
      console.log('Fetching rooms for hostel:', selectedHostel, 'and floor:', selectedFloor);
      
      // First, let's log all rooms for this hostel and floor to see what we're getting
      const { data: allRooms, error: allRoomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', selectedHostel)
        .eq('floor', selectedFloor);
      
      console.log('All rooms for this hostel and floor:', allRooms);

      // Now get only available rooms
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', selectedHostel)
        .eq('floor', selectedFloor)
        .eq('status', 'available');
      
      if (error) {
        console.error('Error fetching rooms:', error);
        throw error;
      }

      console.log('Available rooms before filtering:', data);

      // Filter rooms client-side where current_occupancy < capacity
      const availableRooms = data.filter(room => {
        const currentOccupancy = room.current_occupancy || 0;
        const capacity = parseInt(room.capacity);
        const isAvailable = currentOccupancy < capacity;
        console.log(`Room ${room.number}: occupancy=${currentOccupancy}, capacity=${capacity}, isAvailable=${isAvailable}`);
        return isAvailable;
      });
      
      console.log('Final available rooms:', availableRooms);
      return availableRooms as Room[];
    },
  });

  const handleHostelChange = (value: string) => {
    console.log('Hostel changed to:', value);
    setSelectedHostel(value);
    form.setValue("hostel_id", value);
    form.setValue("floor", "");
    form.setValue("room_id", "");
    setSelectedFloor("");
  };

  const handleFloorChange = (value: string) => {
    console.log('Floor changed to:', value);
    setSelectedFloor(value);
    form.setValue("floor", value);
    form.setValue("room_id", "");
  };

  const getFloorOptions = () => {
    const selectedHostelData = hostels.find(h => h.id === selectedHostel);
    if (!selectedHostelData) return [];
    return Array.from({ length: selectedHostelData.total_floors }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`
    }));
  };

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="hostel_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hostel</FormLabel>
            <Select onValueChange={handleHostelChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingHostels ? "Loading hostels..." : "Select hostel"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id}>
                    {hostel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="floor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Floor</FormLabel>
            <Select 
              onValueChange={handleFloorChange} 
              value={field.value}
              disabled={!selectedHostel}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={!selectedHostel ? "Select a hostel first" : "Select floor"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {getFloorOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="room_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={!selectedFloor || isLoadingRooms}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      !selectedFloor 
                        ? "Select a floor first" 
                        : isLoadingRooms 
                          ? "Loading rooms..." 
                          : rooms.length === 0 
                            ? "No available rooms" 
                            : "Select room"
                    } 
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.number} ({room.current_occupancy || 0}/{room.capacity} occupied)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}