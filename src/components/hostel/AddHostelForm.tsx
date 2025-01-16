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
import { Hostel } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  total_floors: z.coerce.number().min(1, "Must have at least 1 floor"),
  warden_name: z.string().min(2, "Warden name must be at least 2 characters"),
  warden_contact: z.string().min(10, "Contact number must be at least 10 characters"),
  warden_email: z.string().email("Invalid email address").optional().nullable(),
  photo: z.any().optional(),
});

interface AddHostelFormProps {
  onSubmit: (data: Hostel) => void;
}

export function AddHostelForm({ onSubmit }: AddHostelFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      total_floors: 0,
      warden_name: "",
      warden_contact: "",
      warden_email: "",
      photo: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = null;

    if (values.photo instanceof FileList && values.photo.length > 0) {
      const file = values.photo[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hostels')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hostels')
        .getPublicUrl(fileName);

      photoUrl = publicUrl;
    }

    const newHostel: Hostel = {
      id: crypto.randomUUID(),
      name: values.name,
      address: values.address,
      total_floors: values.total_floors,
      warden_name: values.warden_name,
      warden_contact: values.warden_contact,
      warden_email: values.warden_email,
      status: "active" as const,
      buildings: ["A"],
      amenities: ["WiFi"],
      occupied_rooms: 0,
      photo: photoUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSubmit(newHostel);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hostel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_floors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Floors</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warden_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warden Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter warden name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warden_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warden Contact</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warden_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warden Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Hostel Photo</FormLabel>
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
          Add Hostel
        </Button>
      </form>
    </Form>
  );
}