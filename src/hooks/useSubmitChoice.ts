import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSubmitChoice(valentineId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitChoice = async (choice: 'YES' | 'NO') => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('valentines')
        .update({
          receiver_choice: choice,
          status: 'complete',
          completed_at: new Date().toISOString(),
        })
        .eq('id', valentineId)

      if (error) throw error
      return true
    } catch (err) {
      console.error('Failed to submit choice:', err)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitChoice, isSubmitting }
}
