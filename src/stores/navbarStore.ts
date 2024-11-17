import {defineStore} from "pinia";
import {ref} from "vue";
import type {Ref} from "vue"

export const useNavbarStore = defineStore('navbar', ()=> {

  const menuOpen: Ref<boolean> = ref(false)

  function toggleMenu():void{
    menuOpen.value = !menuOpen.value
  }

  function closeMenu(): void {
    menuOpen.value = false
  }

  return {
    menuOpen, toggleMenu, closeMenu
  }
})