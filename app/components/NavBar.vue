<template>
	<div class="flex justify-between py-3 w-full">
		<NuxtLink to="/">
			<h1 class="font-bold text-2xl">
				Ekubo
			</h1>
		</NuxtLink>
		<div class="flex gap-3">
			<UButton v-if="!authToken" class="flex justify-center items-center" icon="material-symbols:person-add-rounded" to="/login" size="md" color="info" variant="solid">Login / SignUp</UButton>
			<UDropdownMenu 
				v-else 
				arrow
				:items="dropdownItems" 
				:content="{
					align: 'start',
					side: 'bottom',
					sideOffset: 6
				}"
			>
				<UButton class="flex justify-center items-center" size="md" color="info" variant="solid">{{ userData.username }}</UButton>
			</UDropdownMenu>
			<UButton class="flex justify-center items-center" to="/create" size="md" color="primary" variant="solid">Add Song</UButton>
			<ThemeToggleButton />
		</div>
	</div>
</template>

<script setup lang="ts">
const authToken = useAuthToken()
const userData = useUserData()
const logout = useLogout()

const dropdownItems = [
	{
		label: "Logout",
		icon: "material-symbols:logout-rounded",
		onSelect: logout
	}
]
</script>

<style scoped>

</style>
