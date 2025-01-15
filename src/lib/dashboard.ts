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
  const currentYear = new Date().getFullYear();

  const monthlyPayments = paymentsResult.data.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  const monthlyExpenses = expensesResult.data.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  });

  return {
    totalTenants: tenantsResult.data.length,
    availableRooms: roomsResult.data.filter(room => room.status === 'available').length,
    monthlyRevenue: monthlyPayments.reduce((sum, payment) => sum + Number(payment.amount), 0),
    pendingRequests: roomsResult.data.filter(room => room.status === 'maintenance').length,
    occupancyData: [
      { name: 'Block A', total: 10, occupied: roomsResult.data.filter(r => r.building === 'A' && r.status === 'occupied').length },
      { name: 'Block B', total: 12, occupied: roomsResult.data.filter(r => r.building === 'B' && r.status === 'occupied').length },
      { name: 'Block C', total: 8, occupied: roomsResult.data.filter(r => r.building === 'C' && r.status === 'occupied').length },
    ],
    tenantStats: [
      { name: 'Active', value: tenantsResult.data.filter(t => new Date(t.lease_end) > new Date()).length, color: '#4CAF50' },
      { name: 'Pending', value: tenantsResult.data.filter(t => !t.room_id).length, color: '#FFC107' },
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
    maintenanceData: [
      { name: 'Block A', pending: 3, completed: 12 },
      { name: 'Block B', pending: 2, completed: 8 },
      { name: 'Block C', pending: 1, completed: 10 },
    ],
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
  };
}