<template>
  <div class="flex justify-center items-center h-full w-full">
    <div class="w-full max-w-md p-6 rounded shadow flex flex-col gap-2">
      <UForm :schema="schema" :state="state" @submit="onSubmit">
				<div class="flex flex-col gap-4">
					<UFormField class="w-full" label="Email" name="email" size="xl">
						<UInput v-model="state.email" class="w-full" type="email" autocomplete="email" />
					</UFormField>
					<UFormField class="w-full" label="Password" name="password" size="xl">
						<UInput v-model="state.password" class="w-full" type="password" autocomplete="current-password" />
					</UFormField>
					<UButton class="w-full flex justify-center text-lg" type="submit">
						{{ isLogin ? 'Login' : 'Sign Up' }}
					</UButton>
				</div>
			</UForm>
      <div class="text-center">
        <span>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        </span>
        <UButton class="text-primary underline ml-1" variant="link" @click="toggleMode">
          {{ isLogin ? "Sign Up" : "Login" }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const isLogin = ref(true)
const toggleMode = () => {
	isLogin.value = !isLogin.value
}

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})
type Schema = z.infer<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const endpoint = isLogin.value ? '/api/login' : '/api/signup'
  try {
    await $fetch(endpoint, {
      method: 'POST',
      body: event.data,
    })
  } catch (e) {
		console.error(e)
  }
}
</script>

<style scoped>
</style>

