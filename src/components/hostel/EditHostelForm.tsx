import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hostel } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  totalRooms: z.string().transform(Number),
  totalFloors: z.string().transform(Number),
  wardenName: z.string().min(2, "Warden name must be at least 2 characters"),
  wardenContact: z.string().min(10, "Contact number must be at least 10 characters"),
  wardenEmail: z.string().email("Invalid email address"),
});

interface EditHostelFormProps {
  hostel: Hostel;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function EditHostelForm({ hostel, onSubmit }: EditHostelFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: hostel.name,
      address: hostel.address,
      totalRooms: String(hostel.totalRooms),
      totalFloors: String(hostel.totalFloors),
      wardenName: hostel.warden.name,
      wardenContact: hostel.warden.contact,
      wardenEmail: hostel.warden.email || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostel Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} />
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
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wardenEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warden Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}