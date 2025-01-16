import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
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
import { Room, Tenant } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RoomSelectionGrid } from "./RoomSelectionGrid";
import { useState } from "react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergency_contact: z.string().min(1, "Emergency contact is required"),
  join_date: z.string().min(1, "Join date is required"),
  hostel_id: z.string().min(1, "Hostel is required"),
  floor: z.string().min(1, "Floor is required"),
  room_id: z.string().min(1, "Room selection is required"),
  preferences: z.object({
    roomType: z.string().min(1, "Room type is required"),
    maxRent: z.number().min(0, "Max rent must be positive"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTenantFormProps {
  onSubmit: (data: Tenant) => void;
}

export function AddTenantForm({ onSubmit }: AddTenantFormProps) {
  const [selectedHostel, setSelectedHostel] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      emergency_contact: "",
      join_date: "",
      hostel_id: "",
      floor: "",
      room_id: "",
      preferences: {
        roomType: "single", // Set a default value for roomType
        maxRent: 0, // Set a default value for maxRent
      },
    },
  });

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
      return data;
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

  const handleSubmit = (values: FormValues) => {
    const newTenant: Tenant = {
      id: crypto.randomUUID(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      emergency_contact: values.emergency_contact,
      join_date: values.join_date,
      lease_end: "", // Removed as per requirement
      room_id: values.room_id,
      preferences: {
        roomType: values.preferences.roomType,
        maxRent: values.preferences.maxRent,
      },
      documents: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSubmit(newTenant);
    form.reset();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />

        <FormField
          control={form.control}
          name="join_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Join Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {rooms.map((room) => (
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

        <FormField
          control={form.control}
          name="preferences.roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Room Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferences.maxRent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Rent Budget</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Tenant
        </Button>
      </form>
    </Form>
  );
}