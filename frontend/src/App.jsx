import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Pastikan pakai Navbar yang tadi saya berikan
import Home from "./pages/Home";
import Category from "./pages/Category";
import Event from "./pages/Event";
import About from "./pages/About";
import AddPlace from "./pages/AddPlace";
import DetailPlace from "./pages/DetailPlace";
import EditPlace from "./pages/EditPlace";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar di atas (Sticky/Fixed) */}
      <Navbar />

      {/* Container Utama */}
      {/* max-w-6xl: Agar tidak terlalu lebar di layar raksasa, tapi pas di laptop */}
      {/* mx-auto: Agar tetap di tengah tapi lebar */}
      {/* px-4: Memberi jarak (padding) di kiri kanan agar tidak mepet layar HP */}
      {/* pt-20: Memberi jarak dari atas karena tertutup Navbar fixed */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/event" element={<Event />} />
          <Route path="/about" element={<About />} />
          <Route path="/add" element={<AddPlace />} />
          <Route path="/place/:id" element={<DetailPlace />} />
          <Route path="/edit/:id" element={<EditPlace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;