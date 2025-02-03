import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HostelSelector } from "./HostelSelector";
import { FloorSelector } from "./FloorSelector";
import { RoomSelector } from "./RoomSelector";
import { useRoomQueries } from "@/hooks/useRoomQueries";

interface RoomAllocationFieldsProps {
  form: UseFormReturn<any>;
}

export function RoomAllocationFields({ form }: RoomAllocationFieldsProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [totalFloors, setTotalFloors] = useState<number>(0);

  // Fetch hostel details when a hostel is selected
  const { data: hostelDetails } = useQuery({
    queryKey: ['hostel-details', selectedHostel],
    enabled: !!selectedHostel,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('total_floors')
        .eq('id', selectedHostel)
        .single();

      if (error) throw error;
      setTotalFloors(data.total_floors);
      return data;
    }
  });

  // Use the custom hook for room queries
  const { data: availableRooms = [], isLoading: isLoadingRooms } = useRoomQueries({
    hostelId: selectedHostel,
    floor: selectedFloor
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

  return (
    <div className="space-y-4">
      <HostelSelector 
        form={form} 
        onHostelChange={handleHostelChange} 
      />

      <FloorSelector 
        form={form}
        onFloorChange={handleFloorChange}
        selectedHostel={selectedHostel}
        totalFloors={totalFloors}
      />

      <RoomSelector 
        form={form}
        rooms={availableRooms}
        isLoading={isLoadingRooms}
        selectedFloor={selectedFloor}
      />
    </div>
  );
}