import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestRegister = () => {
  const { testRegister } = useAuth();

  useEffect(() => {
    const registerUser = async () => {
      await testRegister();
    };
    registerUser();
  }, [testRegister]);

  return <div>Testando registro de usuário...</div>;
};

export default TestRegister;
