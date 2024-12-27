import { supabase } from './supabaseClient';

export const competitionService = {
  async getCompetitions() {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar competições:', error);
      throw error;
    }
    return data;
  },

  async getCompetitionsByUser(userId) {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar competições do usuário:', error);
      throw error;
    }
    return data;
  },

  async addCompetition(competitionData) {
    const { data, error } = await supabase
      .from('competitions')
      .insert([{
        ...competitionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Erro ao adicionar competição:', error);
      throw error;
    }
    return data[0];
  },

  async updateCompetition(id, competitionData) {
    const { data, error } = await supabase
      .from('competitions')
      .update({
        ...competitionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar competição:', error);
      throw error;
    }
    return data[0];
  },

  async deleteCompetition(id) {
    const { error } = await supabase
      .from('competitions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar competição:', error);
      throw error;
    }
  }
};
