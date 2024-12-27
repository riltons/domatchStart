import { supabase } from './supabaseClient';

export const playerService = {
  async getPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async addPlayer(playerData) {
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updatePlayer(id, playerData) {
    const { data, error } = await supabase
      .from('players')
      .update(playerData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deletePlayer(id) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
