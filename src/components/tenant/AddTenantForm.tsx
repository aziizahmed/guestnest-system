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
import { Room, Tenant } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RoomSelectionGrid } from "./RoomSelectionGrid";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  joinDate: z.string().min(1, "Join date is required"),
  leaseEnd: z.string().min(1, "Lease end date is required"),
  building: z.string().min(1, "Building is required"),
  floor: z.string().min(1, "Floor is required"),
  roomId: z.string().min(1, "Room selection is required"),
  preferences: z.object({
    roomType: z.string().min(1, "Room type is required"),
    maxRent: z.number().min(0, "Max rent must be positive"),
  }),
});

interface AddTenantFormProps {
  onSubmit: (data: Tenant) => void;
  rooms: Room[];
}

export function AddTenantForm({ onSubmit, rooms }: AddTenantFormProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedFloor, setSelectedFloor] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      joinDate: "",
      leaseEnd: "",
      building: "",
      floor: "",
      roomId: "",
      preferences: {
        roomType: "",
        maxRent: 0,
      },
    },
  });

  const filteredRooms = rooms.filter(room => 
    (!selectedBuilding || room.building === selectedBuilding) &&
    (!selectedFloor || room.floor === selectedFloor)
  );

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    form.setValue("building", value);
    form.setValue("floor", "");
    form.setValue("roomId", "");
    setSelectedFloor("");
  };

  const handleFloorChange = (value: string) => {
    setSelectedFloor(value);
    form.setValue("floor", value);
    form.setValue("roomId", "");
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      emergencyContact: values.emergencyContact,
      joinDate: values.joinDate,
      leaseEnd: values.leaseEnd,
      preferences: values.preferences,
    };
    onSubmit(newTenant);
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="joinDate"
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
            name="leaseEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lease End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="building"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building/Block</FormLabel>
                <Select onValueChange={handleBuildingChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">Block A</SelectItem>
                    <SelectItem value="B">Block B</SelectItem>
                    <SelectItem value="C">Block C</SelectItem>
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
                  disabled={!selectedBuilding}
                >
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
        </div>

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
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Room</FormLabel>
              <FormControl>
                <RoomSelectionGrid
                  rooms={filteredRooms}
                  selectedRoom={field.value}
                  onSelect={(roomId) => form.setValue("roomId", roomId)}
                  preferredType={form.watch("preferences.roomType")}
                />
              </FormControl>
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