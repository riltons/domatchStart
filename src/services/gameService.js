import { supabase } from './supabaseClient';

export const gameService = {
  async getGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getGamesByCompetition(competitionId) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('competicao_id', competitionId);
    
    if (error) throw error;
    return data;
  },

  async addGame(gameData) {
    const { data, error } = await supabase
      .from('games')
      .insert([gameData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateGame(id, gameData) {
    const { data, error } = await supabase
      .from('games')
      .update(gameData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteGame(id) {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
