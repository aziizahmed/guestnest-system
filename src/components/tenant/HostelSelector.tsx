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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HostelSelectorProps {
  form: UseFormReturn<any>;
  onHostelChange: (value: string) => void;
}

export function HostelSelector({ form, onHostelChange }: HostelSelectorProps) {
  const { data: hostels = [], isLoading } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      console.log('Fetching hostels...');
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching hostels:', error);
        throw error;
      }
      console.log('Hostels fetched:', data);
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="hostel_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hostel</FormLabel>
          <Select onValueChange={onHostelChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading hostels..." : "Select hostel"} />
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
  );
}