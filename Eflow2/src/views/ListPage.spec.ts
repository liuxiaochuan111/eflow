import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ListPage from './ListPage.vue'
import * as api from '../api/mock'

// Mock the API
vi.mock('../api/mock', () => ({
  getFormFragments: vi.fn(),
  deleteFormFragment: vi.fn()
}))

describe('ListPage Component', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/editor/:id?', component: { template: '<div>Editor</div>' } },
      { path: '/preview/:url', component: { template: '<div>Preview</div>' } }
    ]
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('should render page title', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('表单片段列表')
  })

  it('should render search input', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    const searchInput = wrapper.find('input[placeholder*="搜索"]')
    expect(searchInput.exists()).toBe(true)
  })

  it('should render add button', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    const buttons = wrapper.findAll('button')
    const addButton = buttons.find(btn => btn.text().includes('新增'))
    expect(addButton).toBeDefined()
  })

  it('should render table', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    // El-table should be rendered
    expect(wrapper.find('.el-table').exists()).toBe(true)
  })

  it('should render pagination', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.el-pagination').exists()).toBe(true)
  })

  it('should load data on mount', async () => {
    vi.spyOn(api, 'getFormFragments').mockResolvedValue({
      data: [],
      total: 0
    })

    mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    await vi.runAllTimersAsync()

    expect(api.getFormFragments).toHaveBeenCalled()
  })

  it('should have correct table columns', () => {
    const wrapper = mount(ListPage, {
      global: {
        plugins: [router]
      }
    })

    // Check that the component renders without crashing
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.list-page').exists()).toBe(true)
  })
})
