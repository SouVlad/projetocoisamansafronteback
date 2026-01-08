/**
 * Custom Hook para enviar mensagens de contato
 */

import { useState } from 'react';
import { contactService, CreateContactMessageData } from '@/services/contact.service';

export const useContact = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async (data: CreateContactMessageData) => {
    try {
      setSending(true);
      setError(null);
      setSuccess(false);
      
      await contactService.send(data);
      
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao enviar mensagem';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
    }
  };

  const resetStatus = () => {
    setSuccess(false);
    setError(null);
  };

  return {
    sendMessage,
    sending,
    error,
    success,
    resetStatus,
  };
};
