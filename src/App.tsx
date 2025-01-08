import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tenants from "./pages/Tenants";
import Rooms from "./pages/Rooms";
import RoomAllocation from "./pages/RoomAllocation";
import Maintenance from "./pages/Maintenance";
import Expenses from "./pages/Expenses";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room-allocation" element={<RoomAllocation />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/expenses" element={<Expenses />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;