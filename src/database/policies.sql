-- Criar políticas de acesso para a tabela de usuários
-- Permitir que usuários autenticados possam selecionar, inserir, atualizar e excluir seus próprios dados

-- Permitir que usuários autenticados leiam seus próprios dados
CREATE POLICY "Select own user" 
ON users 
FOR SELECT 
USING (auth.uid()::text::integer = id);

-- Permitir que usuários autenticados insiram novos dados
CREATE POLICY "Insert own user" 
ON users 
FOR INSERT 
WITH CHECK (auth.uid()::text::integer = id);

-- Permitir que usuários autenticados atualizem seus próprios dados
CREATE POLICY "Update own user" 
ON users 
FOR UPDATE 
USING (auth.uid()::text::integer = id);

-- Permitir que usuários autenticados excluam seus próprios dados
CREATE POLICY "Delete own user" 
ON users 
FOR DELETE 
USING (auth.uid()::text::integer = id);
