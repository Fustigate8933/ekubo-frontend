<template>
	<div class="flex justify-center items-center h-full w-full">
		<div class="w-full max-w-md p-6 rounded shadow flex flex-col gap-2">
			<UForm class="flex flex-col gap-4" :schema="schema" :state="state" @submit="onSubmit">
				<UFormField v-if="!isLogin" class="w-full" label="Username" name="username" size="xl">
					<UInput v-model="state.username" class="w-full" type="text" autocomplete="username" />
				</UFormField>
				<UFormField class="w-full" label="Email" name="email" size="xl">
					<UInput v-model="state.email" class="w-full" type="email" autocomplete="email" />
				</UFormField>
				<UFormField class="w-full" label="Password" name="password" size="xl">
					<UInput v-model="state.password" class="w-full" type="password" autocomplete="current-password" />
				</UFormField>
				<UButton class="w-full flex justify-center text-lg" type="submit" :loading="loading">
					{{ isLogin ? 'Login' : 'Sign Up' }}
				</UButton>
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
import type { LoginResponse } from '~/types/song'

definePageMeta({
	middleware: "guest"
})

const route = useRoute()
const router = useRouter()
const authToken = useAuthToken()

const loading = ref(false)
const isLogin = ref(true)

const loginSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(8, 'Minimum 8 characters'),
})
const signupSchema = loginSchema.extend({
	username: z.string().min(3, 'Minimum 3 characters').max(30, 'Maximum 30 characters'),
})
const schema = computed(() => (isLogin.value ? loginSchema : signupSchema))

const toggleMode = () => {
	isLogin.value = !isLogin.value
	state.username = ''
	state.email = ''
	state.password = ''
}
const state = reactive({
	username: '',
	email: '',
	password: '',
})

type LoginFormData = z.infer<typeof schema.value>

async function onSubmit(event: FormSubmitEvent<LoginFormData>) {
	loading.value = true
	const endpoint = isLogin.value ? '/api/login' : '/api/signup'

	try {
		const res = await $fetch<LoginResponse>(endpoint, {
			method: 'POST',
			body: event.data,
		})

		if (isLogin.value) {
			localStorage.setItem("token", res.token)
			authToken.value = res.token

			const redirectUri = (route.query.redirect as string) || "/"
			router.push(redirectUri)
		} else {
			const res = await $fetch<LoginResponse>('/api/login', {
				method: 'POST',
				body: event.data
			})

			localStorage.setItem("token", res.token)
			authToken.value = res.token

			const redirectUri = (route.query.redirect as string) || "/"
			router.push(redirectUri)
		}
	} catch (e) {
		console.error(e)
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
</style>

