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
import { UseFormReturn } from "react-hook-form";
import { AvailableRoom } from "@/types/roomAllocation";

interface RoomSelectorProps {
  form: UseFormReturn<any>;
  rooms: AvailableRoom[];
  isLoading: boolean;
  selectedFloor: string;
}

export function RoomSelector({ form, rooms, isLoading, selectedFloor }: RoomSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="room_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Room</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={!selectedFloor || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    !selectedFloor 
                      ? "Select a floor first" 
                      : isLoading 
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
  );
}