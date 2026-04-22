import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getFormFragments, createFormFragment, updateFormFragment, deleteFormFragment, getFormFragmentByUrl } from './mock'
import type { FormFragment } from '../types'

describe('Mock API', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('getFormFragments', () => {
    it('should return empty array when no data exists', async () => {
      const result = await getFormFragments({ page: 1, pageSize: 10 })
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })

    it('should return paginated list of form fragments', async () => {
      // Create test data
      const fragment1: FormFragment = {
        id: 1,
        url: '/test1',
        label: 'Test Form 1',
        schema: [],
        eventConfig: []
      }
      const fragment2: FormFragment = {
        id: 2,
        url: '/test2',
        label: 'Test Form 2',
        schema: [],
        eventConfig: []
      }

      await createFormFragment(fragment1)
      await createFormFragment(fragment2)

      const result = await getFormFragments({ page: 1, pageSize: 10 })

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.data[0].url).toBe('/test1')
    })

    it('should filter by keyword', async () => {
      const fragment1: FormFragment = {
        id: 1,
        url: '/login',
        label: 'Login Form',
        schema: [],
        eventConfig: []
      }
      const fragment2: FormFragment = {
        id: 2,
        url: '/register',
        label: 'Register Form',
        schema: [],
        eventConfig: []
      }

      await createFormFragment(fragment1)
      await createFormFragment(fragment2)

      const result = await getFormFragments({ page: 1, pageSize: 10, keyword: 'login' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].url).toBe('/login')
    })

    it('should paginate correctly', async () => {
      // Create 15 items
      for (let i = 1; i <= 15; i++) {
        await createFormFragment({
          id: i,
          url: `/test${i}`,
          label: `Test ${i}`,
          schema: [],
          eventConfig: []
        })
      }

      const page1 = await getFormFragments({ page: 1, pageSize: 10 })
      const page2 = await getFormFragments({ page: 2, pageSize: 10 })

      expect(page1.data).toHaveLength(10)
      expect(page2.data).toHaveLength(5)
      expect(page1.total).toBe(15)
    })
  })

  describe('createFormFragment', () => {
    it('should create a new form fragment', async () => {
      const newFragment: FormFragment = {
        url: '/new-form',
        label: 'New Form',
        schema: [],
        eventConfig: []
      }

      const result = await createFormFragment(newFragment)

      expect(result.id).toBeDefined()
      expect(result.url).toBe('/new-form')
      expect(result.label).toBe('New Form')
      expect(result.createdAt).toBeDefined()
    })

    it('should reject duplicate URLs', async () => {
      const fragment: FormFragment = {
        url: '/duplicate',
        label: 'Duplicate',
        schema: [],
        eventConfig: []
      }

      await createFormFragment(fragment)

      await expect(createFormFragment(fragment)).rejects.toThrow('URL已存在')
    })
  })

  describe('updateFormFragment', () => {
    it('should update existing form fragment', async () => {
      const created = await createFormFragment({
        url: '/update-test',
        label: 'Original',
        schema: [],
        eventConfig: []
      })

      const updated = await updateFormFragment(created.id!, {
        label: 'Updated'
      })

      expect(updated.label).toBe('Updated')
      expect(updated.url).toBe('/update-test')
      expect(updated.updatedAt).toBeDefined()
    })

    it('should throw error when updating non-existent fragment', async () => {
      await expect(updateFormFragment(999, { label: 'Test' })).rejects.toThrow('表单片段不存在')
    })
  })

  describe('deleteFormFragment', () => {
    it('should delete form fragment', async () => {
      const created = await createFormFragment({
        url: '/delete-test',
        label: 'Delete Me',
        schema: [],
        eventConfig: []
      })

      await deleteFormFragment(created.id!)

      const list = await getFormFragments({ page: 1, pageSize: 10 })
      expect(list.data).toHaveLength(0)
    })

    it('should throw error when deleting non-existent fragment', async () => {
      await expect(deleteFormFragment(999)).rejects.toThrow('表单片段不存在')
    })
  })

  describe('getFormFragmentByUrl', () => {
    it('should return form fragment by URL', async () => {
      await createFormFragment({
        url: '/find-test',
        label: 'Find Me',
        schema: [],
        eventConfig: []
      })

      const found = await getFormFragmentByUrl('/find-test')

      expect(found).toBeDefined()
      expect(found!.url).toBe('/find-test')
    })

    it('should return null for non-existent URL', async () => {
      const found = await getFormFragmentByUrl('/non-existent')
      expect(found).toBeNull()
    })
  })
})
