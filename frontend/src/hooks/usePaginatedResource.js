import { useCallback, useEffect, useState } from 'react'
import { normalizeListResponse } from '../utils/apiData'

export default function usePaginatedResource(fetcher, deps = []) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (targetPage = page) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetcher({ page: targetPage })
      const normalized = normalizeListResponse(response.data)
      setItems(normalized.items)
      setCount(normalized.count)
      setNext(normalized.next)
      setPrevious(normalized.previous)
      setPage(targetPage)
    } catch (err) {
      setError('Nao foi possivel carregar os dados.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [fetcher, page, ...deps])

  useEffect(() => {
    load(1)
  }, deps)

  return {
    items,
    page,
    count,
    next,
    previous,
    loading,
    error,
    reload: () => load(page),
    goToPage: load,
  }
}

