import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [newestPlaces, setNewestPlaces] = useState([]);
  // Ganti URL ini dengan URL Vercel Backend kamu nanti
  const API_URL = 'http://localhost:3000/api/places'; 

  useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = async () => {
    try {
      const resPop = await axios.get(`${API_URL}/popular`);
      setPopularPlaces(resPop.data);
      
      const resNew = await axios.get(API_URL);
      setNewestPlaces(resNew.data);
    } catch (error) {
      console.error(error);
    }
  };

  const Card = ({ place }) => (
    <Link to={`/place/${place.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden mb-4">
      <img src={place.image_url} alt={place.name} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="font-bold text-lg">{place.name}</h3>
        <p className="text-gray-500 text-sm truncate">{place.location}</p>
      </div>
    </Link>
  );

  return (
    <div>
      {/* Bagian Populer */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Wisata Paling Populer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularPlaces.map(place => <Card key={place.id} place={place} />)}
        </div>
      </section>

      {/* Bagian Terbaru */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Wisata Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newestPlaces.map(place => <Card key={place.id} place={place} />)}
        </div>
      </section>

      {/* Call to Action (CTA) */}
      <section className="bg-blue-100 p-6 rounded-xl text-center mt-10">
        <h3 className="text-xl font-bold mb-2">Punya rekomendasi tempat wisata?</h3>
        <p className="mb-4 text-gray-700">Bantu kami melengkapi katalog wisata ini dengan menambahkan tempat favoritmu.</p>
        <Link to="/add" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
          Tambah Wisata Sekarang
        </Link>
      </section>
    </div>
  );
};

export default Home;