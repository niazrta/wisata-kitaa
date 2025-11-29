import { useState, useEffect, useContext } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // Hapus Link jika tidak dipakai
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DetailPlace = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext); // Ambil user untuk cek login
  const navigate = useNavigate();
  
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // State untuk Ulasan [BARU]
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  const API_URL = 'http://localhost:3000/api/places'; 
  const FAV_URL = 'http://localhost:3000/api/favorites';

  // 1. Fetch Detail Wisata & Ulasan
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Panggil endpoint detail dan reviews secara paralel
        const [placeRes, reviewsRes] = await Promise.all([
            axios.get(`${API_URL}/${id}`),
            axios.get(`${API_URL}/${id}/reviews`)
        ]);
        
        setPlace(placeRes.data);
        setReviews(reviewsRes.data); // Simpan data ulasan
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Cek Favorite (Sama seperti kodemu)
  useEffect(() => {
    if (token && id) {
        const checkFav = async () => {
            try {
                const res = await axios.get(`${FAV_URL}/check/${id}`);
                setIsFavorited(res.data.isFavorited);
            } catch (error) {
                console.error("Gagal cek favorit", error);
            }
        };
        checkFav();
    }
  }, [token, id]);

  
  // 3. Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!token) {
        alert("Silakan login untuk menyimpan wisata ini.");
        navigate('/login');
        return;
    }

    setFavLoading(true);
    try {
        // PERBAIKAN DISINI: Tambahkan headers Authorization
        const res = await axios.post(
            FAV_URL, 
            { place_id: id }, 
            { 
                headers: { 
                    Authorization: `Bearer ${token}` 
                } 
            }
        );
        
        setIsFavorited(res.data.isFavorited); 
    } catch (error) {
        console.error("Error favorite:", error); // Cek console browser untuk detail error
        alert("Gagal memproses favorit.");
    } finally {
        setFavLoading(false);
    }
};

  // 3. Handle Submit Ulasan [BARU]
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
        alert("Login dulu untuk memberi ulasan!");
        navigate('/login');
        return;
    }

    setReviewLoading(true);
    try {
        const res = await axios.post(
            `${API_URL}/${id}/reviews`, 
            { rating: newRating, comment: newComment },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Tambahkan ulasan baru ke list tanpa reload page
        setReviews([res.data, ...reviews]); 
        setNewComment("");
        setNewRating(5);
        alert("Ulasan berhasil dikirim!");
    } catch (error) {
        console.error(error);
        alert("Gagal mengirim ulasan.");
    } finally {
        setReviewLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!place) return <div className="text-center mt-20">Data tidak ditemukan</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* --- Bagian Hero & Info (KODE LAMA MU, TIDAK BERUBAH) --- */}
      <div className="relative w-full h-[400px] md:h-[500px]">
         {/* ... gambar, judul, lokasi, tombol fav ... */}
         <img src={place.image_url} alt={place.name} className="w-full h-full object-cover"/>
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
         
         {/* Tombol Favorite */}
         <button onClick={handleToggleFavorite} disabled={favLoading} className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg hover:bg-white/40 transition disabled:opacity-50 group">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors duration-300 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-white group-hover:text-red-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
         </button>

         <div className="absolute bottom-6 left-4 md:left-10 text-white max-w-2xl">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{place.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-2">{place.name}</h1>
            <p className="text-lg text-gray-200 flex items-center">📍 {place.location}</p>
         </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-0 -mt-10 relative pt-14 z-10">
        <div className="bg-gray-200 rounded-xl shadow-xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Wisata</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify mb-10">
              {place.description}
            </p>

            {/* --- SECTION ULASAN [BARU] --- */}
            <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Ulasan Pengunjung ({reviews.length})</h3>

                {/* Form Input Ulasan */}
                <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-4 rounded-lg">
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <select 
                            value={newRating} 
                            onChange={(e) => setNewRating(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (5 - Sempurna)</option>
                            <option value="4">⭐⭐⭐⭐ (4 - Bagus)</option>
                            <option value="3">⭐⭐⭐ (3 - Biasa)</option>
                            <option value="2">⭐⭐ (2 - Kurang)</option>
                            <option value="1">⭐ (1 - Buruk)</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows="3"
                            placeholder="Bagikan pengalamanmu..."
                            required
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={reviewLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {reviewLoading ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                </form>

                {/* List Ulasan */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">Belum ada ulasan. Jadilah yang pertama!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                            {/* Inisial User (jika tidak ada avatar) */}
                                            ? 
                                        </div>
                                        {/* Jika Anda join table profile, ganti 'Pengunjung' dengan review.profiles.username */}
                                        <span className="font-semibold text-gray-800">Pengunjung</span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex text-yellow-400 text-sm mb-1">
                                    {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* --- END SECTION ULASAN --- */}

          </div>

          {/* Sidebar Info (SAMA SEPERTI KODEMU) */}
          <div className="space-y-6">
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
                <a href={place.map_url} target="_blank" rel="noreferrer" className="block w-full text-center bg-white border border-blue-600 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition">
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