import { supabase } from './supabaseClient';

export const playerService = {
  async getPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar jogadores:', error);
      throw error;
    }
    return data;
  },

  async getPlayersByUser(userId) {
    if (!userId) {
      throw new Error('userId é obrigatório');
    }

    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao buscar jogadores do usuário:', error);
      throw error;
    }
    return data;
  },

  async addPlayer(playerData) {
    try {
      // Validar dados
      if (!playerData.nome) throw new Error('Nome é obrigatório');
      if (!playerData.user_id) throw new Error('user_id é obrigatório');

      // Garantir que temos os campos corretos
      const { nome, apelido = null, celular = null, user_id } = playerData;
      
      console.log('Tentando adicionar jogador:', { nome, apelido, celular, user_id });

      const { data, error } = await supabase
        .from('players')
        .insert([{
          nome,
          apelido,
          celular,
          user_id
        }])
        .select();
      
      if (error) {
        console.error('Erro ao adicionar jogador:', error);
        throw error;
      }

      console.log('Jogador adicionado com sucesso:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Erro ao processar dados do jogador:', error);
      throw error;
    }
  },

  async updatePlayer(id, playerData) {
    try {
      // Validar dados
      if (!id) throw new Error('ID é obrigatório');
      if (!playerData.nome) throw new Error('Nome é obrigatório');

      // Garantir que temos os campos corretos
      const { nome, apelido = null, celular = null } = playerData;
      
      console.log('Tentando atualizar jogador:', { id, nome, apelido, celular });

      const { data, error } = await supabase
        .from('players')
        .update({
          nome,
          apelido,
          celular
        })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Erro ao atualizar jogador:', error);
        throw error;
      }

      console.log('Jogador atualizado com sucesso:', data[0]);
      return data[0];
    } catch (error) {
      console.error('Erro ao processar atualização do jogador:', error);
      throw error;
    }
  },

  async deletePlayer(id) {
    if (!id) throw new Error('ID é obrigatório');

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
