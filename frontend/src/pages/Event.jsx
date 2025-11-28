import { useState, useEffect } from 'react';
import axios from 'axios';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Pastikan table events sudah diisi data dummy di Supabase
    axios.get('http://localhost:3000/api/events').then(res => setEvents(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Event Mendatang</h2>
      <div className="space-y-4">
        {events.length === 0 && <p>Belum ada event.</p>}
        {events.map(event => (
          <div key={event.id} className="bg-white border-l-4 border-blue-500 rounded shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-700 mt-2">{event.location}</p>
              </div>
              {/* Jika ada image_url event */}
              {/* <img src={event.image_url} className="w-20 h-20 object-cover rounded" /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;