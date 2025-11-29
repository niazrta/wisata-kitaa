import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placeRoutes from './routes/placeRoutes.js';
import eventRoutes from './routes/eventRoutes.js'; // Asumsi kamu punya ini
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes Utama
app.get('/', (req, res) => {
    res.send('API Katalog Wisata Running...');
});

app.use('/api/places', placeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes); // Tambahkan ini
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);


// Menjalankan Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
}

export default app;