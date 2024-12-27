import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { competitionService } from '../services/competitionService';
import { playerService } from '../services/playerService';
import { PlayIcon, CheckIcon, ClockIcon, CalendarIcon, UsersIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

function Competitions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [competitionsData, playersData] = await Promise.all([
        competitionService.getCompetitions(),
        playerService.getPlayers()
      ]);
      setCompetitions(competitionsData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar os dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetition = async (competitionData) => {
    try {
      const newCompetition = await competitionService.addCompetition({
        ...competitionData,
        status: 'pending',
        user_id: user.id,
        data_inicio: new Date(competitionData.data_inicio).toISOString(),
        data_fim: new Date(competitionData.data_fim).toISOString()
      });
      setCompetitions([...competitions, newCompetition]);
      closeModal();
    } catch (error) {
      console.error('Erro ao adicionar competição:', error);
      alert('Erro ao adicionar competição. Por favor, tente novamente.');
    }
  };

  const handleEditCompetition = async (competitionData) => {
    try {
      const updatedCompetition = await competitionService.updateCompetition(selectedCompetition.id, {
        ...competitionData,
        data_inicio: new Date(competitionData.data_inicio).toISOString(),
        data_fim: new Date(competitionData.data_fim).toISOString()
      });
      setCompetitions(competitions.map(c => 
        c.id === updatedCompetition.id ? updatedCompetition : c
      ));
      closeModal();
    } catch (error) {
      console.error('Erro ao editar competição:', error);
      alert('Erro ao editar competição. Por favor, tente novamente.');
    }
  };

  const handleDeleteCompetition = async (competitionId) => {
    if (window.confirm('Tem certeza que deseja excluir esta competição?')) {
      try {
        await competitionService.deleteCompetition(competitionId);
        setCompetitions(competitions.filter(c => c.id !== competitionId));
      } catch (error) {
        console.error('Erro ao deletar competição:', error);
        alert('Erro ao deletar competição. Por favor, tente novamente.');
      }
    }
  };

  const handleStatusChange = async (competitionId, newStatus) => {
    try {
      const updatedCompetition = await competitionService.updateCompetition(competitionId, { status: newStatus });
      setCompetitions(competitions.map(c => 
        c.id === competitionId ? updatedCompetition : c
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status. Por favor, tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'finished':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'finished':
        return 'Finalizada';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const openEditModal = (competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompetition(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600 p-4">
          {error}
          <button
            onClick={loadData}
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Competições</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Nova Competição
          </button>
        </div>

        {/* Lista de Competições */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {competitions.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                Nenhuma competição encontrada
              </li>
            ) : (
              competitions.map((competition) => (
                <li key={competition.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/competitions/${competition.id}`)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              competition.status === 'pending' ? 'bg-yellow-100' :
                              competition.status === 'in_progress' ? 'bg-blue-100' :
                              'bg-green-100'
                            }`}>
                              {competition.status === 'pending' && <ClockIcon className="h-6 w-6 text-yellow-600" />}
                              {competition.status === 'in_progress' && <PlayIcon className="h-6 w-6 text-blue-600" />}
                              {competition.status === 'finished' && <CheckIcon className="h-6 w-6 text-green-600" />}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{competition.nome}</h3>
                            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{formatDate(competition.data_inicio)} - {formatDate(competition.data_fim)}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          competition.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          competition.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getStatusText(competition.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{competition.local}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {competition.status === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(competition.id, 'in_progress');
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                          title="Iniciar Competição"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      {competition.status === 'in_progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(competition.id, 'finished');
                          }}
                          className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                          title="Finalizar Competição"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCompetition(competition.id);
                        }}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                        title="Excluir Competição"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCompetition ? 'Editar Competição' : 'Nova Competição'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = {
                  nome: e.target.nome.value,
                  data_inicio: e.target.data_inicio.value,
                  data_fim: e.target.data_fim.value,
                  local: e.target.local.value
                };
                if (selectedCompetition) {
                  handleEditCompetition(formData);
                } else {
                  handleAddCompetition(formData);
                }
              }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    defaultValue={selectedCompetition?.nome || ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_inicio">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    id="data_inicio"
                    name="data_inicio"
                    defaultValue={selectedCompetition?.data_inicio ? new Date(selectedCompetition.data_inicio).toISOString().split('T')[0] : ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data_fim">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    id="data_fim"
                    name="data_fim"
                    defaultValue={selectedCompetition?.data_fim ? new Date(selectedCompetition.data_fim).toISOString().split('T')[0] : ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="local">
                    Local
                  </label>
                  <input
                    type="text"
                    id="local"
                    name="local"
                    defaultValue={selectedCompetition?.local || ''}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
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
                    {selectedCompetition ? 'Salvar' : 'Adicionar'}
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

export default Competitions;
