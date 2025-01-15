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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  total_rooms: z.coerce.number().min(1, "Must have at least 1 room"),
  total_floors: z.coerce.number().min(1, "Must have at least 1 floor"),
  warden_name: z.string().min(2, "Warden name must be at least 2 characters"),
  warden_contact: z.string().min(10, "Contact number must be at least 10 characters"),
  warden_email: z.string().email("Invalid email address").optional().nullable(),
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
      total_rooms: 0,
      total_floors: 0,
      warden_name: "",
      warden_contact: "",
      warden_email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newHostel: Hostel = {
      ...values,
      id: crypto.randomUUID(),
      status: "active" as const,
      buildings: ["A"],
      amenities: ["WiFi"],
      occupied_rooms: 0,
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Rooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
        </div>

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

        <Button type="submit" className="w-full">
          Add Hostel
        </Button>
      </form>
    </Form>
  );
}