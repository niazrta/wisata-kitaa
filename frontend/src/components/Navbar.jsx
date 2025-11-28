import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 rounded-t-4xl left-0 lg:w-fit bg-blue-600 text-white shadow-md z-50 lg:mx-auto">
      <div className="max-w-4xl mx-auto lg:px-14 py-3 flex justify-between items-center">
        {/* <Link to="/" className="text-xl font-bold">WisataKita</Link> */}
        
        {/* Menu Desktop & Mobile Sederhana */}
        <div className="flex space-x-4 text-sm font-medium">
          <Link to="/" className="hover:text-blue-200">Beranda</Link>
          <Link to="/category" className="hover:text-blue-200">Kategori</Link>
          <Link to="/event" className="hover:text-blue-200">Event</Link>
          <Link to="/about" className="hover:text-blue-200">About</Link>
          <Link to="/add" className="hover:text-blue-200">Tambah</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;