import { useState } from 'react';

const useNotification = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [variant, setVariant] = useState<
    'success' | 'danger' | 'warning' | 'info'
  >('info');

  const showNotification = (
    msg: string,
    type: 'success' | 'danger' | 'warning' | 'info'
  ) => {
    setMessage(msg);
    setVariant(type);
  };

  const clearNotification = () => {
    setMessage(null);
  };

  return {
    message,
    variant,
    showNotification,
    clearNotification,
  };
};

export default useNotification;
