import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Alam');
  const [mapUrl, setMapUrl] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null); // File baru (opsional)
  const [oldImage, setOldImage] = useState(''); // Preview gambar lama

  const [loading, setLoading] = useState(false);

  // Ganti port jika perlu
  const API_URL = 'http://localhost:3000/api/places'; 

  // Ambil data lama saat load
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        const data = res.data;
        setName(data.name);
        setDescription(data.description);
        setLocation(data.location);
        setCategory(data.category);
        setMapUrl(data.map_url || '');
        setOpeningHours(data.opening_hours || '');
        setPrice(data.price || '');
        setOldImage(data.image_url);
      } catch (error) {
        alert('Gagal mengambil data');
      }
    };
    fetchPlace();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('map_url', mapUrl);
    formData.append('opening_hours', openingHours);
    formData.append('price', price);
    
    // Hanya append jika user mengganti gambar
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Wisata berhasil diupdate!');
      navigate(`/place/${id}`); // Kembali ke detail
    } catch (error) {
      console.error(error);
      alert('Gagal mengupdate wisata.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-yellow-600">Edit Wisata</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Preview Gambar Lama */}
        {oldImage && (
            <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Gambar Saat Ini:</p>
                <img src={oldImage} alt="Preview" className="w-full h-40 object-cover rounded-lg opacity-80" />
            </div>
        )}

        <input type="text" placeholder="Nama Wisata" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />
        <input type="text" placeholder="Lokasi" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded" required />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
          <option value="Alam">Alam</option>
          <option value="Kuliner">Kuliner</option>
          <option value="Sejarah">Sejarah</option>
          <option value="Belanja">Belanja</option>
        </select>

        <input type="url" placeholder="Link Google Maps" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className="border p-2 rounded" />
        
        <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Jam Buka" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 rounded" />
        </div>

        <textarea placeholder="Deskripsi" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" required />

        <div className="border p-3 rounded bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto (Biarkan kosong jika tidak ingin ganti)</label>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
        </div>

        <div className="flex gap-2 mt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Update Wisata'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Batal
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlace;