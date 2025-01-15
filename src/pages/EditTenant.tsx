import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PersonalInfoFields } from "@/components/tenant/PersonalInfoFields";
import { LeaseFields } from "@/components/tenant/LeaseFields";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { dummyTenants } from "@/data/dummyData";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergency_contact: z.string().min(1, "Emergency contact is required"),
  join_date: z.string().min(1, "Join date is required"),
  lease_end: z.string().min(1, "Lease end date is required"),
});

const EditTenant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const tenant = dummyTenants.find(t => t.id === id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tenant?.name || "",
      email: tenant?.email || "",
      phone: tenant?.phone || "",
      emergency_contact: tenant?.emergency_contact || "",
      join_date: tenant?.join_date || "",
      lease_end: tenant?.lease_end || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Success",
      description: "Tenant updated successfully",
    });
    navigate("/tenants");
  };

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Tenant not found</h2>
        <Button onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
        <h1 className="text-2xl font-bold">Edit Tenant</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <LeaseFields form={form} />

          <div className="flex gap-4">
            <Button type="submit">Update Tenant</Button>
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

export default EditTenant;
