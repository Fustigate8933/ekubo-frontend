<template>
	<div class="flex flex-col w-full h-full px-6 pb-4">
		<NavBar />
		<div class="flex flex-col flex-1 items-center w-full">
			<div class="w-5xl h-full">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
