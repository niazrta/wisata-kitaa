import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Category = () => {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Alam', 'Kuliner', 'Sejarah', 'Belanja'];

  useEffect(() => {
    axios.get('http://localhost:3000/api/places').then(res => setPlaces(res.data));
  }, []);

  const filteredPlaces = selectedCategory === 'All' 
    ? places 
    : places.filter(p => p.category === selectedCategory);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kategori Wisata</h2>
      {/* Tombol Kategori */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-4 mb-4">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List Wisata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map(place => (
          <Link to={`/place/${place.id}`} key={place.id} className="flex bg-white rounded shadow p-2 hover:bg-blue-50 transition">
            <img src={place.image_url} alt={place.name} className="w-24 h-24 object-cover rounded" />
            <div className="ml-4">
              <h3 className="font-bold">{place.name}</h3>
              <p className="text-xs text-blue-500 bg-blue-100 inline-block px-2 py-1 rounded mt-1">{place.category}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;