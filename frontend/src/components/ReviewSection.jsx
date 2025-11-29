import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ReviewSection = ({ placeId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, token } = useContext(AuthContext);
  const API_URL = 'http://localhost:3000/api/reviews';

  // Fetch Reviews
  useEffect(() => {
    fetchReviews();
  }, [placeId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/${placeId}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Gagal ambil review", error);
    }
  };

  // Handle Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login dulu mas/mbak!");
    
    setLoading(true);
    try {
      await axios.post(API_URL, { place_id: placeId, rating, comment });
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh list
      alert("Terima kasih atas ulasannya!");
    } catch (error) {
      alert("Gagal mengirim ulasan");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Review
  const handleDelete = async (reviewId) => {
    if (window.confirm("Hapus ulasan ini?")) {
        try {
            await axios.delete(`${API_URL}/${reviewId}`);
            fetchReviews();
        } catch (error) {
            alert("Gagal menghapus ulasan");
        }
    }
  };

  // Render Bintang
  const renderStars = (count) => {
    return "⭐".repeat(count);
  };

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Ulasan Pengunjung ({reviews.length})</h3>

      {/* --- Form Input Ulasan --- */}
      {token ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h4 className="font-semibold mb-4">Tulis Ulasanmu</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select 
                value={rating} 
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="5">⭐⭐⭐⭐⭐ (Sangat Bagus)</option>
                <option value="4">⭐⭐⭐⭐ (Bagus)</option>
                <option value="3">⭐⭐⭐ (Cukup)</option>
                <option value="2">⭐⭐ (Kurang)</option>
                <option value="1">⭐ (Buruk)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Komentar</label>
            <textarea 
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalamanmu disini..."
                className="w-full border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg text-center mb-8 border border-blue-100">
            <p className="text-blue-800">Ingin menulis ulasan? <Link to="/login" className="font-bold underline">Login dulu yuk!</Link></p>
        </div>
      )}

      {/* --- Daftar Ulasan --- */}
      <div className="space-y-4">
        {reviews.length === 0 && <p className="text-gray-500 italic text-center">Belum ada ulasan. Jadilah yang pertama!</p>}

        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {review.user_name ? review.user_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-800">{review.user_name}</h5>
                        <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                </div>
                <div className="text-yellow-500 text-sm">
                    {renderStars(review.rating)}
                </div>
            </div>
            
            <p className="text-gray-700 mt-3 leading-relaxed">{review.comment}</p>

            {/* Tombol Hapus (Hanya muncul jika user login adalah pemilik review) */}
            {user && user.id === review.user_id && (
                <button 
                    onClick={() => handleDelete(review.id)}
                    className="mt-3 text-xs text-red-500 font-semibold hover:underline flex items-center gap-1"
                >
                    🗑️ Hapus Ulasan Saya
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;