import type { FormFragment, ListQuery } from '../types'

const STORAGE_KEY = 'form_fragments_data'

// Helper functions for localStorage
const getData = (): FormFragment[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const saveData = (data: FormFragment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Generate unique ID
let nextId = 1
const generateId = (): number => {
  const data = getData()
  const maxId = data.reduce((max, item) => Math.max(max, item.id || 0), 0)
  return Math.max(maxId + 1, nextId++)
}

// API functions
export async function getFormFragments(query: ListQuery): Promise<{ data: FormFragment[]; total: number }> {
  await delay(200) // Simulate network delay

  let data = getData()

  // Filter by keyword
  if (query.keyword) {
    const keyword = query.keyword.toLowerCase()
    data = data.filter(item =>
      item.url.toLowerCase().includes(keyword) ||
      item.label.toLowerCase().includes(keyword)
    )
  }

  const total = data.length

  // Pagination
  const start = (query.page - 1) * query.pageSize
  const end = start + query.pageSize
  const paginatedData = data.slice(start, end)

  return {
    data: paginatedData,
    total
  }
}

export async function createFormFragment(fragment: FormFragment): Promise<FormFragment> {
  await delay(200)

  const data = getData()

  // Check for duplicate URL
  if (data.some(item => item.url === fragment.url)) {
    throw new Error('URL已存在')
  }

  const newFragment: FormFragment = {
    ...fragment,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  data.push(newFragment)
  saveData(data)

  return newFragment
}

export async function updateFormFragment(id: number, updates: Partial<FormFragment>): Promise<FormFragment> {
  await delay(200)

  const data = getData()
  const index = data.findIndex(item => item.id === id)

  if (index === -1) {
    throw new Error('表单片段不存在')
  }

  // Check for duplicate URL if URL is being updated
  if (updates.url && updates.url !== data[index].url) {
    if (data.some(item => item.url === updates.url && item.id !== id)) {
      throw new Error('URL已存在')
    }
  }

  data[index] = {
    ...data[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString()
  }

  saveData(data)

  return data[index]
}

export async function deleteFormFragment(id: number): Promise<void> {
  await delay(200)

  const data = getData()
  const index = data.findIndex(item => item.id === id)

  if (index === -1) {
    throw new Error('表单片段不存在')
  }

  data.splice(index, 1)
  saveData(data)
}

export async function getFormFragmentByUrl(url: string): Promise<FormFragment | null> {
  await delay(100)

  const data = getData()
  const fragment = data.find(item => item.url === url)

  return fragment || null
}

// Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
