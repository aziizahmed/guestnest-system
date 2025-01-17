import * as z from "zod";

export const tenantFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  emergency_contact: z.string().min(1, "Emergency contact is required"),
  join_date: z.string().min(1, "Join date is required"),
  hostel_id: z.string().min(1, "Hostel selection is required"),
  floor: z.string().min(1, "Floor is required"),
  room_id: z.string().min(1, "Room selection is required"),
  preferences: z.object({
    roomType: z.string(),
    maxRent: z.number(),
  }),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;