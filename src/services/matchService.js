import { supabase } from './supabaseClient';

export const matchService = {
  async getMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getMatchesByGame(gameId) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('game_id', gameId);
    
    if (error) throw error;
    return data;
  },

  async addMatch(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateMatch(id, matchData) {
    const { data, error } = await supabase
      .from('matches')
      .update(matchData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteMatch(id) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
