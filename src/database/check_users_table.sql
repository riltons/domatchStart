-- Verificar a estrutura da tabela de usuários
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
