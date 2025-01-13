import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { PersonalInfoFields } from "@/components/tenant/PersonalInfoFields";
import { LeaseFields } from "@/components/tenant/LeaseFields";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  joinDate: z.string().min(1, "Join date is required"),
  leaseEnd: z.string().min(1, "Lease end date is required"),
  hostelId: z.string().min(1, "Hostel selection is required"),
  floor: z.string().min(1, "Floor is required"),
  roomId: z.string().min(1, "Room selection is required"),
  documents: z.array(z.object({
    id: z.string(),
    type: z.string(),
    url: z.string()
  })).optional(),
});

const AddTenant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      joinDate: "",
      leaseEnd: "",
      hostelId: "",
      floor: "",
      roomId: "",
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload to your storage service
      console.log("File selected:", file);
      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Success",
      description: "Tenant added successfully",
    });
    navigate("/tenants");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <LeaseFields form={form} />
          
          <div className="space-y-4">
            <Label>Documents</Label>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="aadhar">Aadhar Card</Label>
                <Input
                  id="aadhar"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="other">Other Documents</Label>
                <Input
                  id="other"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Add Tenant</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/tenants")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddTenant;