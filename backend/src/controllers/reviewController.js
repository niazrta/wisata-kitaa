import supabase from '../config/supabaseClient.js';

// 1. Ambil Review berdasarkan Place ID
export const getReviewsByPlace = async (req, res) => {
    const { placeId } = req.params;
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('place_id', placeId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Tambah Review
export const addReview = async (req, res) => {
    const { place_id, rating, comment } = req.body;
    const user = req.user; // Dari middleware verifyToken

    if (!rating || !comment) {
        return res.status(400).json({ error: "Rating dan komentar wajib diisi" });
    }

    try {
        // Ambil nama user dari metadata (atau email jika tidak ada nama)
        const userName = user.user_metadata?.full_name || user.email.split('@')[0];

        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                place_id,
                user_id: user.id,
                user_name: userName,
                rating,
                comment
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Hapus Review (Hanya pemilik yang bisa hapus)
export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        // Cek dulu apakah review ini milik user yang login
        const { data: review, error: fetchError } = await supabase
            .from('reviews')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !review) return res.status(404).json({ error: "Review tidak ditemukan" });

        if (review.user_id !== user_id) {
            return res.status(403).json({ error: "Anda tidak berhak menghapus ulasan ini" });
        }

        // Hapus
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;

        res.status(200).json({ message: "Ulasan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};