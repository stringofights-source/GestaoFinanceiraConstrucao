export const formatCurrency = (value, options = {}) =>
  new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    ...options,
  }).format(Number(value || 0))

export const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('pt-PT')
}

