import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getVisitorId } from '@/lib/visitor'

interface CreateValentineParams {
  senderName: string
  receiverName: string
  characterType: 'alpaca' | 'dino' | 'panda' | 'otter' | 'lobster' | 'penguin'
  loveNote?: string
}

export function useCreateValentine() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [valentineId, setValentineId] = useState<string | null>(null)

  const createValentine = async (params: CreateValentineParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const visitorId = getVisitorId()

      // Map singular to plural for DB
      const dbCharacterType = params.characterType + 's'

      const { data, error: dbError } = await supabase
        .from('valentines')
        .insert({
          sender_name: params.senderName,
          receiver_name: params.receiverName,
          sender_visitor_id: visitorId,
          character_type: dbCharacterType,
          love_note: params.loveNote || null,
          sender_choice: 'YES',
          status: 'sent',
        })
        .select('id')
        .single()

      if (dbError) throw dbError

      setValentineId(data.id)
      return data.id
    } catch (err: any) {
      setError(err.message || 'Failed to create valentine')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createValentine, isLoading, error, valentineId }
}
