import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate } from './formatters'

describe('formatters', () => {
  it('formats EUR currency for pt-PT', () => {
    expect(formatCurrency(1234.5)).toContain('1')
    expect(formatCurrency(1234.5)).toContain('€')
  })

  it('returns dash for empty dates', () => {
    expect(formatDate(null)).toBe('-')
  })
})
