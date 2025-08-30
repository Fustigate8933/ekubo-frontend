<template>
	<div class="flex justify-between py-3 w-full">
		<NuxtLink to="/">
			<h1 class="font-bold text-2xl">
				Ekubo
			</h1>
		</NuxtLink>
		<div class="flex gap-3">
			<UButton class="flex justify-center items-center" icon="material-symbols:person-add-rounded" to="/login" size="md" color="secondary" variant="solid">Login / SignUp</UButton>
			<UButton class="flex justify-center items-center" icon="material-symbols:add-circle-outline" to="/create" size="md" color="primary" variant="solid">Add Song</UButton>
			<ThemeToggleButton />
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
