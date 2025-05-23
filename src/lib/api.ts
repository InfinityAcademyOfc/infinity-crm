
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "";

export const sendMessage = async (sessionId: string, to: string, body: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        number: to,
        message: body
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error("Falha ao enviar mensagem");
    return false;
  }
};

export const fetchMessages = async (sessionId: string, contactId: string) => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/messages/${contactId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const fetchContacts = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};
