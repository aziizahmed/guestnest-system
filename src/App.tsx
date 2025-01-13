import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Tenants from "./pages/Tenants";
import Rooms from "./pages/Rooms";
import Expenses from "./pages/Expenses";
import Payments from "./pages/Payments";
import TenantDetails from "./pages/TenantDetails";
import RoomDetails from "./pages/RoomDetails";
import Hostels from "./pages/Hostels";
import AddTenant from "./pages/AddTenant";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";
import HostelDetails from "./pages/HostelDetails";
import Reports from "./pages/Reports";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/hostels/:id" element={<HostelDetails />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/tenants/add" element={<AddTenant />} />
          <Route path="/tenants/:id" element={<TenantDetails />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/add" element={<AddRoom />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms/:id/edit" element={<EditRoom />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;