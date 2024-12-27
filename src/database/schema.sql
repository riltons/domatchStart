-- Criação da tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de jogadores
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    apelido VARCHAR(100),
    celular VARCHAR(15),
    user_id INT REFERENCES users(id)
);

-- Criação da tabela de competições
CREATE TABLE competitions (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    local VARCHAR(100)
);

-- Criação da tabela de partidas
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    competicao_id INT REFERENCES competitions(id),
    jogador1_id INT REFERENCES players(id),
    jogador2_id INT REFERENCES players(id),
    resultado VARCHAR(50),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de jogos
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    competicao_id INT REFERENCES competitions(id),
    jogador1_id INT REFERENCES players(id),
    jogador2_id INT REFERENCES players(id),
    resultado VARCHAR(50),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
