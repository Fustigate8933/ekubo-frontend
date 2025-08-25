<template>
  <UButton
    class="text-center flex justify-center items-center"
    :icon="icon"
    size="md"
    color="neutral"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const icon = computed(() =>
  colorMode.value === 'dark' ? 'line-md:sunny-outline-loop' : 'line-md:moon-alt-loop'
)

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
