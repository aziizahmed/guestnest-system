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
  const { data: hostels = [] } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*');
      
      if (error) throw error;
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
      building: (hostels.find(h => h.id === values.hostel_id)?.buildings?.[0]) || 'A',
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1st Floor</SelectItem>
                  <SelectItem value="2">2nd Floor</SelectItem>
                  <SelectItem value="3">3rd Floor</SelectItem>
                  <SelectItem value="4">4th Floor</SelectItem>
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