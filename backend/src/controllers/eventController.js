import supabase from '../config/supabaseClient.js';

export const getAllEvents = async (req, res) => {
    try {
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};