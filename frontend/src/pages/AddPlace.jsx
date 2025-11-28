import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPlace = () => {
  // Field State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Alam');
  const [mapUrl, setMapUrl] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

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
    formData.append('image', imageFile);

    try {
      // Pastikan port sesuai (3000/5000)
      await axios.post('http://localhost:3000/api/places', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Wisata berhasil ditambahkan!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan wisata.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Tambah Wisata Baru</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        
        {/* Nama & Kategori */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wisata</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Alam">Alam</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Sejarah">Sejarah</option>
              <option value="Belanja">Belanja</option>
            </select>
          </div>
        </div>

        {/* Lokasi & Maps */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Kota/Daerah)</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
            <input type="url" placeholder="https://maps.google.com/..." value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Jam & Harga */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
            <input type="text" placeholder="08.00 - 17.00" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket</label>
            <input type="text" placeholder="Rp 10.000 / Gratis" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        {/* Upload Foto */}
        <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto Utama</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4 disabled:bg-gray-400">
          {loading ? 'Menyimpan...' : 'Simpan Wisata'}
        </button>
      </form>
    </div>
  );
};

export default AddPlace;