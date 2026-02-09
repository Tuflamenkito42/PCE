<script setup>
import CookieConsent from '@/components/CookieConsent.vue'
const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CookieConsent />
</template>
