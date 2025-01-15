import { supabase } from "@/integrations/supabase/client";

export async function fetchDashboardStats() {
  console.log("Fetching dashboard stats...");
  
  const [tenantsResult, roomsResult, paymentsResult, expensesResult] = await Promise.all([
    supabase.from("tenants").select("*"),
    supabase.from("rooms").select("*"),
    supabase.from("payments").select("*"),
    supabase.from("expenses").select("*")
  ]);

  if (tenantsResult.error) throw tenantsResult.error;
  if (roomsResult.error) throw roomsResult.error;
  if (paymentsResult.error) throw paymentsResult.error;
  if (expensesResult.error) throw expensesResult.error;

  const currentMonth = new Date().getMonth();
  const previousMonth = new Date().getMonth() - 1;
  const currentYear = new Date().getFullYear();

  // Calculate current and previous month stats
  const currentMonthTenants = tenantsResult.data.filter(tenant => {
    const joinDate = new Date(tenant.join_date);
    return joinDate.getMonth() === currentMonth && 
           joinDate.getFullYear() === currentYear;
  });

  const previousMonthTenants = tenantsResult.data.filter(tenant => {
    const joinDate = new Date(tenant.join_date);
    return joinDate.getMonth() === previousMonth && 
           joinDate.getFullYear() === currentYear;
  });

  const currentMonthPayments = paymentsResult.data.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  const previousMonthPayments = paymentsResult.data.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === previousMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  // Calculate percentage changes
  const tenantChange = previousMonthTenants.length > 0 
    ? ((currentMonthTenants.length - previousMonthTenants.length) / previousMonthTenants.length * 100).toFixed(1)
    : "0";

  const currentMonthRevenue = currentMonthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const previousMonthRevenue = previousMonthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  
  const revenueChange = previousMonthRevenue > 0
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
    : "0";

  // Calculate maintenance stats by building
  const maintenanceByBuilding = roomsResult.data.reduce((acc, room) => {
    if (!acc[room.building]) {
      acc[room.building] = { pending: 0, completed: 0 };
    }
    if (room.status === 'maintenance') {
      acc[room.building].pending++;
    } else {
      acc[room.building].completed++;
    }
    return acc;
  }, {} as Record<string, { pending: number; completed: number }>);

  // Calculate occupancy data
  const occupancyByBuilding = roomsResult.data.reduce((acc, room) => {
    if (!acc[room.building]) {
      acc[room.building] = { total: 0, occupied: 0 };
    }
    acc[room.building].total++;
    if (room.status === 'occupied' || (room.current_occupancy && room.current_occupancy > 0)) {
      acc[room.building].occupied++;
    }
    return acc;
  }, {} as Record<string, { total: number; occupied: number }>);

  return {
    totalTenants: tenantsResult.data.length,
    availableRooms: roomsResult.data.filter(room => room.status === 'available').length,
    monthlyRevenue: currentMonthRevenue,
    pendingRequests: roomsResult.data.filter(room => room.status === 'maintenance').length,
    occupancyData: Object.entries(occupancyByBuilding).map(([name, data]) => ({
      name: `Block ${name}`,
      total: data.total,
      occupied: data.occupied
    })),
    tenantStats: [
      { 
        name: 'Active', 
        value: tenantsResult.data.filter(t => new Date(t.lease_end) > new Date()).length, 
        color: '#4CAF50' 
      },
      { 
        name: 'Pending', 
        value: tenantsResult.data.filter(t => !t.room_id).length, 
        color: '#FFC107' 
      },
    ],
    revenueData: Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthPayments = paymentsResult.data.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() === month.getMonth() && 
               paymentDate.getFullYear() === month.getFullYear();
      });
      return {
        month: month.toLocaleString('default', { month: 'short' }),
        revenue: monthPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      };
    }).reverse(),
    maintenanceData: Object.entries(maintenanceByBuilding).map(([name, data]) => ({
      name: `Block ${name}`,
      pending: data.pending,
      completed: data.completed
    })),
    recentActivity: [
      ...paymentsResult.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map(payment => ({
          text: `Payment received: ₹${payment.amount}`,
          time: new Date(payment.date).toLocaleDateString(),
        })),
      ...expensesResult.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map(expense => ({
          text: `Expense recorded: ${expense.category} - ₹${expense.amount}`,
          time: new Date(expense.date).toLocaleDateString(),
        })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 3),
    changes: {
      tenants: `${Number(tenantChange) > 0 ? '+' : ''}${tenantChange}%`,
      revenue: `${Number(revenueChange) > 0 ? '+' : ''}${revenueChange}%`,
      maintenance: '0', // Neutral change for maintenance requests
    }
  };
}