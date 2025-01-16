import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room, Hostel } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const formSchema = z.object({
  hostel_id: z.string().min(1, "Hostel is required"),
  floor: z.string().min(1, "Floor is required"),
  number: z.string().min(1, "Room number is required"),
  capacity: z.string().min(1, "Capacity is required"),
  price: z.string().min(1, "Price is required"),
  status: z.enum(["available", "occupied", "maintenance"]),
  photo: z.any().optional(),
});

interface AddRoomFormProps {
  onSubmit: (data: Room) => void;
  initialData?: Partial<Room>;
  isEditing?: boolean;
}

export function AddRoomForm({ onSubmit, initialData, isEditing = false }: AddRoomFormProps) {
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const { data: hostels = [] } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      console.log('Fetching hostels data...');
      const { data, error } = await supabase
        .from('hostels')
        .select('*');
      
      if (error) throw error;
      console.log('Hostels data fetched:', data);
      return data as Hostel[];
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostel_id: initialData?.hostel_id || "",
      floor: initialData?.floor || "",
      number: initialData?.number || "",
      capacity: initialData?.capacity || "",
      price: initialData?.price || "",
      status: initialData?.status || "available",
      photo: initialData?.photo || "",
    },
  });

  const handleHostelChange = (hostelId: string) => {
    const hostel = hostels.find(h => h.id === hostelId);
    setSelectedHostel(hostel || null);
    form.setValue('hostel_id', hostelId);
  };

  // Generate floor options based on selected hostel's total floors
  const getFloorOptions = () => {
    if (!selectedHostel) return [];
    return Array.from({ length: selectedHostel.total_floors }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`
    }));
  };

  // Helper function to add ordinal suffixes (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = values.photo;

    if (values.photo instanceof FileList && values.photo.length > 0) {
      const file = values.photo[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('rooms')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('rooms')
        .getPublicUrl(fileName);

      photoUrl = publicUrl;
    }

    const newRoom: Room = {
      id: initialData?.id || crypto.randomUUID(),
      hostel_id: values.hostel_id,
      number: values.number,
      floor: values.floor,
      building: (selectedHostel?.buildings?.[0]) || 'A',
      type: "single",
      capacity: values.capacity,
      price: values.price,
      status: values.status,
      current_occupancy: 0,
      amenities: [],
      photo: photoUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSubmit(newRoom);
    if (!isEditing) {
      form.reset();
      setSelectedHostel(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="hostel_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostel</FormLabel>
              <Select 
                onValueChange={(value) => handleHostelChange(value)} 
                defaultValue={field.value}
              >
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
                onValueChange={field.onChange} 
                defaultValue={field.value}
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
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <FormControl>
                <Input placeholder="101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Month</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Room Photo</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isEditing ? "Update Room" : "Add Room"}
        </Button>
      </form>
    </Form>
  );
}
