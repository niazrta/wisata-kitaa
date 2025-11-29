import express from 'express';
import { getReviewsByPlace, addReview, deleteReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Bisa baca review tanpa login
router.get('/:placeId', getReviewsByPlace);

// Protected: Harus login untuk nambah/hapus
router.post('/', verifyToken, addReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;