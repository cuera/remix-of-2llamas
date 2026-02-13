import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const COUNTER_OFFSET = 1008

export function useValentineCount() {
  const [count, setCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count: totalCount, error } = await supabase
          .from('valentines')
          .select('id', { count: 'exact', head: true })

        if (error) throw error
        setCount(totalCount || 0)
      } catch (err) {
        console.error('Failed to fetch count:', err)
        setCount(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCount()

    // Optional: Subscribe to realtime inserts to increment count
    const channel = supabase
      .channel('valentines-count')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'valentines',
        },
        () => {
          setCount((prev) => (prev !== null ? prev + 1 : null))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { count, isLoading }
}
