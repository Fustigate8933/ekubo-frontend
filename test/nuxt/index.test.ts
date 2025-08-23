// test/nuxt/index.test.ts
import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

describe('Index page (nuxt integration)', async () => {
  await setup({})

  it('renders index route', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Choose a song to practice')
  })

  it('uses default layout', async () => {
    const html = await $fetch('/')
    // If default.vue has a <NavBar>, check for it
    expect(html).toContain('Ekubo')
  })
})

