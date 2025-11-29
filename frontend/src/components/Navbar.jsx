import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // Helper untuk mengecek link aktif
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500";

  return (
    // Menggunakan backdrop-blur untuk efek kaca
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            WisataKita 🌴
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8 text-sm font-medium items-center">
            <Link to="/" className={isActive('/')}>Beranda</Link>
            <Link to="/category" className={isActive('/category')}>Kategori</Link>
            <Link to="/event" className={isActive('/event')}>Event</Link>
            <Link to="/favorites" className={isActive('/favorites')}>Favorit</Link>
            
            {token ? (
              <Link to="/profile" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                Profil Saya
              </Link>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-sm">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;