import { supabase } from "@/integrations/supabase/client";
import { Hostel, Tenant } from "@/types";

// Hostel APIs
export async function fetchHostels() {
  console.log("Fetching hostels...");
  const { data, error } = await supabase
    .from("hostels")
    .select("*");
  
  if (error) {
    console.error("Error fetching hostels:", error);
    throw error;
  }
  
  console.log("Hostels fetched:", data);
  return data;
}

export async function createHostel(hostel: Omit<Hostel, "id" | "created_at" | "updated_at">) {
  console.log("Creating hostel:", hostel);
  const { data, error } = await supabase
    .from("hostels")
    .insert(hostel)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating hostel:", error);
    throw error;
  }
  
  console.log("Hostel created:", data);
  return data;
}

export async function updateHostel(id: string, hostel: Partial<Hostel>) {
  console.log("Updating hostel:", id, hostel);
  const { data, error } = await supabase
    .from("hostels")
    .update(hostel)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating hostel:", error);
    throw error;
  }
  
  console.log("Hostel updated:", data);
  return data;
}

export async function deleteHostel(id: string) {
  console.log("Deleting hostel:", id);
  const { error } = await supabase
    .from("hostels")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting hostel:", error);
    throw error;
  }
  
  console.log("Hostel deleted:", id);
}

// Tenant APIs
export async function fetchTenants() {
  console.log("Fetching tenants...");
  const { data, error } = await supabase
    .from("tenants")
    .select(`
      *,
      room:rooms(
        number,
        building,
        floor
      )
    `);
  
  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
  
  console.log("Tenants fetched:", data);
  return data;
}

export async function createTenant(tenant: Omit<Tenant, "id" | "room">) {
  console.log("Creating tenant:", tenant);
  const { data, error } = await supabase
    .from("tenants")
    .insert(tenant)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }
  
  console.log("Tenant created:", data);
  return data;
}

export async function updateTenant(id: string, tenant: Partial<Omit<Tenant, "room">>) {
  console.log("Updating tenant:", id, tenant);
  const { data, error } = await supabase
    .from("tenants")
    .update(tenant)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating tenant:", error);
    throw error;
  }
  
  console.log("Tenant updated:", data);
  return data;
}

export async function deleteTenant(id: string) {
  console.log("Deleting tenant:", id);
  const { error } = await supabase
    .from("tenants")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting tenant:", error);
    throw error;
  }
  
  console.log("Tenant deleted:", id);
}
