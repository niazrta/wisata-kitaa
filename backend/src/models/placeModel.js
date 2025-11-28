// backend/src/models/placeModel.js
import { supabase } from "../config/supabaseClient.js";

export const PlaceModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("places")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("places")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from("places")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { message: "Place deleted" };
  },
};
