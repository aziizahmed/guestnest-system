import { useNavigate } from "react-router-dom";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AddTenantForm from "@/components/tenant/AddTenantForm";

const AddTenant = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
      <AddTenantForm />
    </div>
  );
};

export default AddTenant;
