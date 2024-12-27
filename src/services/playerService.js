import { supabase } from './supabaseClient';

export const playerService = {
  async getPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar jogadores:', error);
      throw error;
    }
    return data;
  },

  async getPlayersByUser(userId) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar jogadores do usuário:', error);
      throw error;
    }
    return data;
  },

  async addPlayer(playerData) {
    try {
      // Garantir que temos os campos corretos
      const { nome, apelido, celular, user_id } = playerData;
      
      const { data, error } = await supabase
        .from('players')
        .insert([{
          nome,
          apelido,
          celular,
          user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('Erro ao adicionar jogador:', error);
        throw error;
      }
      return data[0];
    } catch (error) {
      console.error('Erro ao processar dados do jogador:', error);
      throw error;
    }
  },

  async updatePlayer(id, playerData) {
    try {
      // Garantir que temos os campos corretos
      const { nome, apelido, celular } = playerData;
      
      const { data, error } = await supabase
        .from('players')
        .update({
          nome,
          apelido,
          celular,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Erro ao atualizar jogador:', error);
        throw error;
      }
      return data[0];
    } catch (error) {
      console.error('Erro ao processar atualização do jogador:', error);
      throw error;
    }
  },

  async deletePlayer(id) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar jogador:', error);
      throw error;
    }
  }
};
