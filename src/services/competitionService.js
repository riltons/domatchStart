import { supabase } from './supabaseClient';

export const competitionService = {
  async getCompetitions() {
    const { data, error } = await supabase
      .from('competitions')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async addCompetition(competitionData) {
    const { data, error } = await supabase
      .from('competitions')
      .insert([competitionData])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateCompetition(id, competitionData) {
    const { data, error } = await supabase
      .from('competitions')
      .update(competitionData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteCompetition(id) {
    const { error } = await supabase
      .from('competitions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
