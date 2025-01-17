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
  const { data: hostels = [] } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      console.log('Fetching hostels...');
      const { data, error } = await supabase
        .from('hostels')
        .select('*');
      
      if (error) throw error;
      console.log('Hostels fetched:', data);
      return data;
    },
  });

  // Fetch rooms based on selected hostel and floor
  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms', selectedHostel, selectedFloor],
    enabled: !!selectedHostel && !!selectedFloor,
    queryFn: async () => {
      console.log('Fetching rooms...');
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', selectedHostel)
        .eq('floor', selectedFloor);
      
      if (error) throw error;
      console.log('Rooms fetched:', data);
      return data as Room[];
    },
  });

  const handleHostelChange = (value: string) => {
    setSelectedHostel(value);
    form.setValue("hostel_id", value);
    form.setValue("floor", "");
    form.setValue("room_id", "");
    setSelectedFloor("");
  };

  const handleFloorChange = (value: string) => {
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
      <h2 className="text-lg font-semibold">Room Allocation</h2>
      
      <FormField
        control={form.control}
        name="hostel_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hostel</FormLabel>
            <Select onValueChange={handleHostelChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel" />
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
                  <SelectValue placeholder={selectedHostel ? "Select floor" : "Select a hostel first"} />
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
              disabled={!selectedFloor}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={selectedFloor ? "Select room" : "Select a floor first"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rooms
                  .filter(room => Number(room.current_occupancy) < Number(room.capacity))
                  .map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.number} ({room.current_occupancy}/{room.capacity} occupied)
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