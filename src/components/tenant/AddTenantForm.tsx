import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { RoomAllocationFields } from "./RoomAllocationFields";
import { TenantFormValues, tenantFormSchema } from "./tenantFormSchema";
import { Tenant } from "@/types";

const AddTenantForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      emergency_contact: "",
      join_date: "",
      lease_end: "",
      hostel_id: "",
      floor: "",
      room_id: "",
      documents: {
        aadhar: "",
        others: [],
      },
      preferences: {
        roomType: "single",
        maxRent: 0,
      },
    },
  });

  const onSubmit = async (values: TenantFormValues) => {
    try {
      console.log('Submitting form with values:', values);
      
      // Handle file uploads first
      let aadharUrl = "";
      let otherDocUrls: string[] = [];

      if (values.documents?.aadhar) {
        const file = values.documents.aadhar as unknown as File;
        const { data: aadharData, error: aadharError } = await supabase.storage
          .from('rooms')
          .upload(`documents/${values.name}/aadhar/${file.name}`, file);

        if (aadharError) throw aadharError;
        aadharUrl = aadharData.path;
      }

      if (values.documents?.others?.length) {
        const files = values.documents.others as unknown as File[];
        for (const file of files) {
          const { data: docData, error: docError } = await supabase.storage
            .from('rooms')
            .upload(`documents/${values.name}/others/${file.name}`, file);

          if (docError) throw docError;
          otherDocUrls.push(docData.path);
        }
      }

      const newTenant: Tenant = {
        id: crypto.randomUUID(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        emergency_contact: values.emergency_contact,
        join_date: values.join_date,
        lease_end: values.lease_end,
        room_id: values.room_id,
        preferences: {
          roomType: values.preferences.roomType,
          maxRent: values.preferences.maxRent,
        },
        documents: [
          { type: 'aadhar', url: aadharUrl },
          ...otherDocUrls.map(url => ({ type: 'other', url }))
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: tenantError } = await supabase
        .from('tenants')
        .insert(newTenant);

      if (tenantError) throw tenantError;

      // Create room allocation
      const roomAllocation = {
        room_id: values.room_id,
        tenant_id: newTenant.id,
        start_date: values.join_date,
        duration: 3, // Default duration in months
        status: 'active',
      };

      const { error: allocationError } = await supabase
        .from('room_allocations')
        .insert(roomAllocation);

      if (allocationError) throw allocationError;

      // Update room's current occupancy
      const { data: selectedRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', values.room_id)
        .single();

      if (selectedRoom) {
        const { error: roomError } = await supabase
          .from('rooms')
          .update({ 
            current_occupancy: (selectedRoom.current_occupancy || 0) + 1,
            status: Number(selectedRoom.current_occupancy) + 1 >= Number(selectedRoom.capacity) ? 'occupied' : 'available'
          })
          .eq('id', values.room_id);

        if (roomError) throw roomError;
      }

      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
      navigate("/tenants");
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        title: "Error",
        description: "Failed to add tenant",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <PersonalInfoFields form={form} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Room Allocation</h2>
              <RoomAllocationFields form={form} />
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

export default AddTenantForm;