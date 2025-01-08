import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { toast } = useToast();

  const form = useForm<Tenant>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      joinDate: "",
      leaseEnd: "",
      preferences: {
        roomType: "",
        maxRent: 0,
      },
    },
  });

  const onSubmit = (data: Tenant) => {
    const newTenant = {
      ...data,
      id: Date.now().toString(),
    };
    setTenants([...tenants, newTenant]);
    toast({
      title: "Success",
      description: "Tenant added successfully",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="preferences.roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Room Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="preferences.maxRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Rent Budget</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="font-semibold text-lg mb-2">{tenant.name}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Email: {tenant.email}</p>
              <p>Phone: {tenant.phone}</p>
              <p>Emergency Contact: {tenant.emergencyContact}</p>
              <p>Join Date: {tenant.joinDate}</p>
              <p>Lease Ends: {tenant.leaseEnd}</p>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="font-medium text-gray-700">Preferences</p>
                <p>Room Type: {tenant.preferences?.roomType}</p>
                <p>Max Rent: ₹{tenant.preferences?.maxRent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tenants;