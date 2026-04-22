import { describe, it, expect } from 'vitest'
import router from './index'

describe('Router Configuration', () => {
  it('should have list page route', () => {
    expect(router.hasRoute('List')).toBe(true)
  })

  it('should have orchestration page route', () => {
    expect(router.hasRoute('Editor')).toBe(true)
  })

  it('should have preview page route', () => {
    expect(router.hasRoute('Preview')).toBe(true)
  })

  it('should have correct path for list route', () => {
    const listRoute = router.resolve({ name: 'List' })
    expect(listRoute.path).toBe('/')
  })

  it('should have correct path for editor route', () => {
    const editorRoute = router.resolve({ name: 'Editor', params: { id: '123' } })
    expect(editorRoute.path).toContain('/editor/123')
  })

  it('should have correct path for preview route', () => {
    const previewRoute = router.resolve({ name: 'Preview', params: { url: 'test-page' } })
    expect(previewRoute.path).toContain('/preview/test-page')
  })
})
