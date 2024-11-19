<template>
  <div class="site-wrapper">
    <nav>
      <router-link :to="{name: 'user-data'}">Meine Daten</router-link>
      <router-link :to="{name: 'user-orders'}">Meine Bestellungen</router-link>
    </nav>
    <RouterView/>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>