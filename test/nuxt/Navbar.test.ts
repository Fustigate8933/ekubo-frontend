import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NavBar from '@/components/NavBar.vue'

describe('NavBar testing', () => {
  it('renders Ekubo title', async () => {
    const wrapper = await mountSuspended(NavBar)
    expect(wrapper.text()).toContain('Ekubo')
  })

  it('renders a home link', async () => {
    const wrapper = await mountSuspended(NavBar)
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/')
  })
})

