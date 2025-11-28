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
        const { data, error } = await supabase.from('places').select('*').limit(3);
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

// 4. Tambah Wisata (Create) - Update Field Baru
export const createPlace = async (req, res) => {
    // Ambil field baru dari body
    const { name, description, location, category, map_url, opening_hours, price } = req.body;
    const file = req.file;

    if (!name || !file) {
        return res.status(400).json({ error: 'Nama dan Foto wajib diisi' });
    }

    try {
        // A. Upload Foto
        const fileName = `wisata-${Date.now()}-${file.originalname}`;
        const { error: uploadError } = await supabase
            .storage
            .from('wisata-images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype
            });

        if (uploadError) throw uploadError;

        // B. Ambil URL Foto
        const { data: urlData } = supabase
            .storage
            .from('wisata-images')
            .getPublicUrl(fileName);

        const image_url = urlData.publicUrl;

        // C. Simpan ke Database (Termasuk field map_url, price, dll)
        const { data, error } = await supabase
            .from('places')
            .insert([{ 
                name, 
                description, 
                location, 
                category, 
                image_url,
                map_url,
                opening_hours,
                price
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Edit Wisata (Update)
export const updatePlace = async (req, res) => {
    const { id } = req.params;
    const { name, description, location, category, map_url, opening_hours, price } = req.body;
    const file = req.file;

    try {
        let updateData = { 
            name, 
            description, 
            location, 
            category, 
            map_url, 
            opening_hours, 
            price 
        };

        // Jika user mengupload foto baru, proses upload ulang
        if (file) {
            const fileName = `wisata-${Date.now()}-${file.originalname}`;
            const { error: uploadError } = await supabase
                .storage
                .from('wisata-images')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase
                .storage
                .from('wisata-images')
                .getPublicUrl(fileName);

            updateData.image_url = urlData.publicUrl;
        }

        const { data, error } = await supabase
            .from('places')
            .update(updateData)
            .eq('id', id)
            .select();

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
        // Hapus data dari tabel
        const { error } = await supabase.from('places').delete().eq('id', id);
        if (error) throw error;
        
        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};