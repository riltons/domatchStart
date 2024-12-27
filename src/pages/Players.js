import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { playerService } from '../services/playerService';

function Players() {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const data = await playerService.getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  };

  const handleAddPlayer = async (playerData) => {
    try {
      const newPlayer = await playerService.addPlayer({
        ...playerData,
        user_id: user.id
      });
      setPlayers([...players, newPlayer]);
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
    }
  };

  const handleEditPlayer = async (playerData) => {
    try {
      const updatedPlayer = await playerService.updatePlayer(selectedPlayer.id, playerData);
      setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
      setSelectedPlayer(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar jogador:', error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await playerService.deletePlayer(playerId);
      setPlayers(players.filter(p => p.id !== playerId));
    } catch (error) {
      console.error('Erro ao deletar jogador:', error);
    }
  };

  const openModal = (player = null) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Jogadores</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Jogador
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(player => (
            <div key={player.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{player.nome}</h2>
              {player.apelido && <p className="text-gray-600 mb-2">Apelido: {player.apelido}</p>}
              {player.celular && <p className="text-gray-600 mb-4">Celular: {player.celular}</p>}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openModal(player)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {selectedPlayer ? 'Editar Jogador' : 'Adicionar Jogador'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  nome: e.target.nome.value,
                  apelido: e.target.apelido.value,
                  celular: e.target.celular.value
                };
                if (selectedPlayer) {
                  handleEditPlayer(formData);
                } else {
                  handleAddPlayer(formData);
                }
                closeModal();
              }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    defaultValue={selectedPlayer?.nome || ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apelido">
                    Apelido
                  </label>
                  <input
                    type="text"
                    id="apelido"
                    name="apelido"
                    defaultValue={selectedPlayer?.apelido || ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="celular">
                    Celular
                  </label>
                  <input
                    type="tel"
                    id="celular"
                    name="celular"
                    defaultValue={selectedPlayer?.celular || ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {selectedPlayer ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Players;
