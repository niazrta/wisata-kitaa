import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DetailPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ganti sesuai port backend kamu (3000 atau 5000)
  const API_URL = 'http://localhost:3000/api/places'; 

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setPlace(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Yakin ingin menghapus wisata ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Wisata berhasil dihapus");
        navigate('/');
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!place) return <div className="text-center mt-20">Data tidak ditemukan</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* 1. Hero Image Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <img 
          src={place.image_url} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-6 left-4 md:left-10 text-white max-w-2xl">
          <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {place.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-2">{place.name}</h1>
          <p className="text-lg text-gray-200 flex items-center">
            📍 {place.location}
          </p>
        </div>
      </div>

      {/* 2. Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Wisata</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify">
              {place.description}
            </p>

            {/* Action Buttons (CRUD) */}
            <div className="mt-8 flex gap-4">
              <Link 
                to={`/edit/${place.id}`} 
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Edit Wisata
              </Link>
              <button 
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            
            {/* Info Card */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-4 text-lg">Informasi Penting</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">🕒 Jam Operasional</p>
                <p className="font-medium text-gray-800">{place.opening_hours || '-'}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">🎟 Harga Tiket</p>
                <p className="font-medium text-gray-800">{place.price || 'Gratis'}</p>
              </div>

              {place.map_url && (
                <a 
                  href={place.map_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full text-center bg-white border border-blue-600 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition"
                >
                  Lihat di Google Maps
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPlace;