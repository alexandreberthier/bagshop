<template>
    <nav>
      <Navbar/>
      <CartNavSlider/>
    </nav>
    <main>
      <RouterView/>
    </main>
    <footer>

    </footer>

</template>

<script setup lang="ts">

import {useUserStore} from "@/stores/userStore";

const userStore = useUserStore()

userStore.fetchUser()


import Navbar from "@/components/Navbar.vue";
import CartNavSlider from "@/components/CartNavSlider.vue";

</script>

<style scoped>


nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
}

</style>