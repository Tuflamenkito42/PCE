<script setup>
const { checkAuth } = useAuth()
// Check auth on startup
onMounted(() => {
  checkAuth()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
