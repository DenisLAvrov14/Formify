// src/hooks/useAuthForm.ts
import { useState, useCallback } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../components/services/firebase';

const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleMode = useCallback(() => setIsRegister(!isRegister), [isRegister]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Registration successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      }
    } catch (error) {
      setError('Failed to authenticate. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, isRegister]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isRegister,
    toggleMode,
    handleSubmit,
    error,
    loading,
  };
};

export default useAuthForm;
