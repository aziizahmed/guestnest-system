import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Tenants from "./pages/Tenants";
import Rooms from "./pages/Rooms";
import { Toaster } from "@/components/ui/toaster";

function App() {
  console.log("Rendering App component");
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;