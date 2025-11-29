import supabase from '../config/supabaseClient.js'; 

// 1. Ambil Semua Wisata
export const getAllPlaces = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Ambil Wisata Populer
export const getPopularPlaces = async (req, res) => {
    try {
        // Ambil dari VIEW, bukan tabel 'places' biasa
        // View ini sudah otomatis mengurutkan dari like terbanyak
        const { data, error } = await supabase
            .from('popular_places_view') 
            .select('*')
            .limit(3); // Ambil Top 3

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Ambil Detail Wisata by ID
export const getPlaceById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Wisata tidak ditemukan" });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//tambahan
export const getPlacesByUser = async (req, res) => {
    const userId = req.user.id; // Didapat dari middleware verifyToken
    try {
        const { data, error } = await supabase
            .from('places')
            .select('*')
            .eq('user_id', userId); // Filter berdasarkan ID user yang login

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Tambah Wisata (Create) - Update Field Baru
export const createPlace = async (req, res) => {
    const { name, description, location, category, map_url, opening_hours, price } = req.body;
    const file = req.file;
    const userId = req.user.id; // Didapat dari middleware

    if (!name || !file) return res.status(400).json({ error: 'Nama dan Foto wajib diisi' });

    try {
        const fileName = `wisata-${Date.now()}-${file.originalname}`;
        const { error: uploadError } = await supabase.storage.from('wisata-images').upload(fileName, file.buffer, { contentType: file.mimetype });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('wisata-images').getPublicUrl(fileName);
        const image_url = urlData.publicUrl;

        const { data, error } = await supabase
            .from('places')
            .insert([{ name, description, location, category, image_url, map_url, opening_hours, price, user_id: userId }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Edit Wisata (Update)
export const updatePlace = async (req, res) => { /* ... KODE SEBELUMNYA ... */ 
    // Copas kode updatePlace kamu yg lama disini
    // Tips: Idealnya cek dulu apakah req.user.id == places.user_id sebelum update
    const { id } = req.params;
    const { name, description, location, category, map_url, opening_hours, price } = req.body;
    const file = req.file;

    try {
        let updateData = { name, description, location, category, map_url, opening_hours, price };
        if (file) {
            const fileName = `wisata-${Date.now()}-${file.originalname}`;
            const { error: uploadError } = await supabase.storage.from('wisata-images').upload(fileName, file.buffer, { contentType: file.mimetype });
            if (uploadError) throw uploadError;
            const { data: urlData } = supabase.storage.from('wisata-images').getPublicUrl(fileName);
            updateData.image_url = urlData.publicUrl;
        }
        const { data, error } = await supabase.from('places').update(updateData).eq('id', id).select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// 6. Hapus Wisata (Delete)
export const deletePlace = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('places').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getReviewsByPlaceId = async (req, res) => {
    const { id } = req.params;
    try {
        // Asumsi: Anda punya tabel 'reviews' dan tabel 'profiles' (atau users) yang terhubung
        // select('*, profiles(username, avatar_url)') digunakan jika ada relasi
        const { data, error } = await supabase
            .from('reviews')
            .select('*') // Ubah jadi .select('*, profiles(username)') jika ingin nama user
            .eq('place_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addReview = async (req, res) => {
    const { id } = req.params; // place_id
    const { rating, comment } = req.body;
    const userId = req.user.id; // Dari middleware verifyToken

    if (!rating || !comment) {
        return res.status(400).json({ error: "Rating dan komentar wajib diisi" });
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ 
                place_id: id, 
                user_id: userId, 
                rating: parseInt(rating), 
                comment 
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};