import express from 'express';
import multer from 'multer';
import { 
    getAllPlaces, 
    getPopularPlaces, 
    getPlaceById, 
    createPlace, 
    updatePlace, 
    deletePlace 
} from '../controllers/placeController.js'; // Pastikan path benar

const router = express.Router();

// Setup Multer (Menyimpan file di RAM sementara sebelum ke Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Definisi Route
router.get('/', getAllPlaces);
router.get('/popular', getPopularPlaces);
router.get('/:id', getPlaceById);

// POST: Tambah Data (Wajib ada file image)
router.post('/', upload.single('image'), createPlace);

// PUT: Edit Data (File image opsional)
router.put('/:id', upload.single('image'), updatePlace);

// DELETE: Hapus Data
router.delete('/:id', deletePlace);

export default router;