import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getVisitorId } from '@/lib/visitor'

export type Role = 'sender' | 'receiver' | 'stranger'

export interface Valentine {
  id: string
  sender_name: string
  receiver_name: string
  character_type: string
  love_note: string | null
  sender_choice: 'YES' | 'NO'
  receiver_choice: 'YES' | 'NO' | null
  status: 'sent' | 'opened' | 'complete'
  created_at: string
  opened_at: string | null
  completed_at: string | null
}

export function useValentine(valentineId: string) {
  const [valentine, setValentine] = useState<Valentine | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadValentine = async () => {
      try {
        const visitorId = getVisitorId()

        // Fetch valentine
        const { data, error: fetchError } = await supabase
          .from('valentines')
          .select('*')
          .eq('id', valentineId)
          .single()

        if (fetchError) throw fetchError
        if (!data) throw new Error('Valentine not found')

        // Determine role
        let userRole: Role
        if (data.sender_visitor_id === visitorId) {
          userRole = 'sender'
        } else if (data.receiver_visitor_id === visitorId) {
          userRole = 'receiver'
        } else if (!data.receiver_visitor_id) {
          // New receiver - claim it
          userRole = 'receiver'
          await supabase
            .from('valentines')
            .update({
              receiver_visitor_id: visitorId,
              status: 'opened',
              opened_at: new Date().toISOString(),
            })
            .eq('id', valentineId)

          // Update local data
          data.receiver_visitor_id = visitorId
          data.status = 'opened'
          data.opened_at = new Date().toISOString()
        } else {
          userRole = 'stranger'
        }

        setValentine(data)
        setRole(userRole)
      } catch (err: any) {
        setError(err.message || 'Failed to load valentine')
      } finally {
        setIsLoading(false)
      }
    }

    loadValentine()

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`valentine-${valentineId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'valentines',
          filter: `id=eq.${valentineId}`,
        },
        (payload) => {
          setValentine(payload.new as Valentine)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [valentineId])

  return { valentine, role, isLoading, error }
}
