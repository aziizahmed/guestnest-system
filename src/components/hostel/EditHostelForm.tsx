import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hostel } from "@/types";
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
      total_floors: hostel.total_floors,
      warden_name: hostel.warden_name,
      warden_contact: hostel.warden_contact,
      warden_email: hostel.warden_email || "",
      photo: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let photoUrl = hostel.photo;

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

    onSubmit({ ...values, photo: photoUrl });
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

        <FormField
          control={form.control}
          name="total_floors"
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

        <FormField
          control={form.control}
          name="warden_name"
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
          name="warden_contact"
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
          name="warden_email"
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
              {hostel.photo && (
                <div className="mt-2">
                  <img src={hostel.photo} alt={hostel.name} className="w-32 h-32 object-cover rounded" />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}