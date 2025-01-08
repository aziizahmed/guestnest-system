import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface AllocationFormData {
  roomId: string;
  tenantId: string;
  startDate: string;
  duration: string;
}

const RoomAllocation = () => {
  const [allocations, setAllocations] = useState<AllocationFormData[]>([]);
  const { toast } = useToast();

  const form = useForm<AllocationFormData>({
    defaultValues: {
      roomId: "",
      tenantId: "",
      startDate: "",
      duration: "",
    },
  });

  const onSubmit = (data: AllocationFormData) => {
    setAllocations([...allocations, data]);
    toast({
      title: "Success",
      description: "Room allocated successfully",
    });
    form.reset();
  };

  // Mock data - replace with actual data from your state management
  const availableRooms = [
    { id: "1", number: "101" },
    { id: "2", number: "102" },
  ];

  const availableTenants = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Allocation</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Allocate Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocate Room to Tenant</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              Room {room.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Tenant</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tenant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableTenants.map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (months)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[3, 6, 12].map((months) => (
                            <SelectItem key={months} value={months.toString()}>
                              {months} months
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Allocate Room
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((allocation, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="space-y-2">
              <p className="text-gray-600">
                Room: {availableRooms.find(r => r.id === allocation.roomId)?.number}
              </p>
              <p className="text-gray-600">
                Tenant: {availableTenants.find(t => t.id === allocation.tenantId)?.name}
              </p>
              <p className="text-gray-600">Start Date: {allocation.startDate}</p>
              <p className="text-gray-600">Duration: {allocation.duration} months</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAllocation;