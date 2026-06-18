export const normalizeListResponse = (data) => ({
  items: data?.results || data || [],
  count: data?.count ?? (Array.isArray(data) ? data.length : 0),
  next: data?.next || null,
  previous: data?.previous || null,
})

export const errorToMessage = (error, fallback = 'Ocorreu um erro. Tente novamente.') => {
  const data = error?.response?.data
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join(' | ')
}

export const fetchAllPages = async (fetcher) => {
  let page = 1
  let allItems = []
  let total = null

  do {
    const response = await fetcher({ page })
    const normalized = normalizeListResponse(response.data)
    allItems = allItems.concat(normalized.items)
    total = normalized.count
    if (!normalized.next || allItems.length >= total) break
    page += 1
  } while (true)

  return allItems
}
