import { supabase } from './supabaseClient';

export const competitionService = {
  async getCompetitions() {
    const { data, error } = await supabase
      .from('competitions')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar competições:', error);
      throw error;
    }
    return data;
  },

  async getCompetitionsByUser(userId) {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }

    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao buscar competições do usuário:', error);
      throw error;
    }
    return data;
  },

  async addCompetition(competitionData) {
    try {
      // Validar dados
      if (!competitionData.nome) throw new Error('Nome é obrigatório');
      if (!competitionData.user_id) throw new Error('user_id é obrigatório');

      console.log('Tentando adicionar competição:', competitionData);

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

      console.log('Competição adicionada com sucesso:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Erro ao processar dados da competição:', error);
      throw error;
    }
  },

  async updateCompetition(id, competitionData) {
    try {
      // Validar dados
      if (!id) throw new Error('ID é obrigatório');
      if (!competitionData.nome) throw new Error('Nome é obrigatório');

      console.log('Tentando atualizar competição:', { id, ...competitionData });

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

      console.log('Competição atualizada com sucesso:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Erro ao processar atualização da competição:', error);
      throw error;
    }
  },

  async deleteCompetition(id) {
    if (!id) throw new Error('ID é obrigatório');

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
