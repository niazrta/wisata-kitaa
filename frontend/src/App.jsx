import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Category from './pages/Category';
import Event from './pages/Event';
import About from './pages/About';
import AddPlace from './pages/AddPlace';
import DetailPlace from './pages/DetailPlace';
import EditPlace from './pages/EditPlace'; 
import DetailEvent from './pages/DetailEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';

function App() {
  return (
    // Mengubah background menjadi sedikit lebih abu-abu untuk kontras
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans pb-20 md:pb-0">
      <Navbar />
      {/* Mengubah max-w-4xl menjadi max-w-7xl agar lebih luas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/category" element={<Category />} />
          <Route path="/event" element={<Event />} />
          <Route path="/about" element={<About />} />
          <Route path="/add" element={<AddPlace />} />
          <Route path="/place/:id" element={<DetailPlace />} />
          <Route path="/edit/:id" element={<EditPlace />} />
          <Route path="/event/:id" element={<DetailEvent />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;