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
  name: z.string().min(1, "Hostel name is required"),
  address: z.string().min(1, "Address is required"),
  totalRooms: z.string().min(1, "Total rooms is required"),
  totalFloors: z.string().min(1, "Total floors is required"),
  wardenName: z.string().min(1, "Warden name is required"),
  wardenContact: z.string().min(1, "Warden contact is required"),
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
      totalRooms: "",
      totalFloors: "",
      wardenName: "",
      wardenContact: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newHostel: Hostel = {
      id: Date.now().toString(),
      name: values.name,
      address: values.address,
      totalRooms: Number(values.totalRooms),
      totalFloors: Number(values.totalFloors),
      buildings: ["A"], // Default value
      amenities: ["WiFi"], // Default value
      status: "active",
      warden: {
        name: values.wardenName,
        contact: values.wardenContact,
      },
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
            name="totalRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Rooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalFloors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Floors</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="wardenName"
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
          name="wardenContact"
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

        <Button type="submit" className="w-full">
          Add Hostel
        </Button>
      </form>
    </Form>
  );
}