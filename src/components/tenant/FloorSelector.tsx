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

interface FloorSelectorProps {
  form: UseFormReturn<any>;
  onFloorChange: (value: string) => void;
  selectedHostel: string;
  totalFloors: number;
}

export function FloorSelector({ form, onFloorChange, selectedHostel, totalFloors }: FloorSelectorProps) {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const floorOptions = Array.from(
    { length: totalFloors }, 
    (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}${getOrdinalSuffix(i + 1)} Floor`
    })
  );

  return (
    <FormField
      control={form.control}
      name="floor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Floor</FormLabel>
          <Select 
            onValueChange={onFloorChange} 
            value={field.value}
            disabled={!selectedHostel}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={!selectedHostel ? "Select a hostel first" : "Select floor"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {floorOptions.map((option) => (
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
  );
}