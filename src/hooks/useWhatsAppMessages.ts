import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSWRConfig } from 'swr'
import useSWR from 'swr'
import { API_URL } from '@/lib/constants'
import { Contact, WhatsAppMessage } from '@/types/whatsapp'

export interface WhatsAppMessagesHookResult {
  messages: WhatsAppMessage[]
  isLoading: boolean
  error: Error | null
  sendMessage: (message: Partial<WhatsAppMessage>) => Promise<void>
  contacts: Contact[]
}

export function useWhatsAppMessages(sessionId?: string): WhatsAppMessagesHookResult {
  const { mutate } = useSWRConfig()
  const [contacts, setContacts] = useState<Contact[]>([])

  const {
    data: messages = [],
    isLoading,
    error,
  } = useSWR<WhatsAppMessage[]>(
    sessionId ? `${API_URL}/messages/${sessionId}` : null,
    async (url: string) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch messages')
      return response.json()
    },
    {
      revalidateOnFocus: true,
      refreshInterval: 5000,
    }
  )

  const sendMessage = async (message: Partial<WhatsAppMessage>) => {
    await fetch(`${API_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    // revalida SWR
    if (sessionId) mutate(`${API_URL}/messages/${sessionId}`)
  }

  // Listener realtime Supabase para novas mensagens
  useEffect(() => {
    if (!sessionId) return

    const channel = supabase
      .channel('whatsapp:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          mutate(`${API_URL}/messages/${sessionId}`)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, mutate])

  // Buscar contatos do Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from('contacts').select('*')
      if (data) setContacts(data)
    }

    fetchContacts()
  }, [])

  return {
    messages,
    isLoading,
    error: error instanceof Error ? error : null,
    sendMessage,
    contacts,
  }
}
