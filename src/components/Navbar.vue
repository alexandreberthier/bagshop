<template>
  <div class="nav-wrapper">
    <router-link
        @click="navbarStore.closeMenu()"
        :to="{name: SiteLinks.Home}">
      <div class="logo-wrapper">
        <img :src="getImage('logo.png')" alt="Logo, zurück zur Startseite">
      </div>
    </router-link>
    <div
        :class="['links', {'open': navbarStore.menuOpen}]">
      <router-link
          @click="navbarStore.closeMenu()"
          v-for="(link, index) in links"
          :key="index"
          :to="{name: link.path}">
        {{ link.name }}
      </router-link>
    </div>
    <div class="icon-section">
      <router-link
          v-if="!userStore.isLoggedIn"
          :to="{name: SiteLinks.Register}">
        <div class="image-wrapper">
          <img :src="getImage('ic_register.png')" alt="Registrieren">
        </div>
      </router-link>
      <router-link
          v-if="!userStore.isLoggedIn"
          :to="{name: SiteLinks.Login}">
        <div class="image-wrapper">
          <img :src="getImage('ic_login.png')" alt="Einloggen">
        </div>
      </router-link>
      <div v-if="userStore.isLoggedIn"
           @click="logOut"
          class="image-wrapper">
        <img :src="getImage('ic_logout.png')" alt="Ausloggen">
      </div>
      <div class="image-wrapper">
        <img :src="getImage('ic_cart.png')" alt="Zum Warenkorb">
      </div>
      <div
          @click="navbarStore.toggleMenu()"
          :class="['burger-menu', {'active': navbarStore.menuOpen}]">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getImage} from "@/utils/ImageUtils";
import {ref} from "vue";
import {SiteLinks} from "@/enums/SiteLinks";
import {useNavbarStore} from "@/stores/navbarStore";
import {useUserStore} from "@/stores/userStore";
import router from "@/router";

const navbarStore = useNavbarStore()
const userStore = useUserStore()

async function logOut(){
  await userStore.logout()
  await router.push({name: SiteLinks.Home})
}

const links = ref([
  {
    name: 'Über uns',
    path: SiteLinks.About
  },
  {
    name: 'Kontakt',
    path: SiteLinks.Contact
  },
  {
    name: 'Faq',
    path: SiteLinks.FAQ
  },
  {
    name: 'Mein Account',
    path: SiteLinks.User
  }
])
</script>

<style scoped>

.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  box-sizing: border-box;
  padding: 0 20px;
  box-shadow: 1px 1px 4px black;
  background-color: var(--white);

  .logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 120px;
      height: auto;
    }
  }

  .links {
    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;
    gap: 32px;
    box-sizing: border-box;
    padding: 50px;
    position: fixed;
    top: 100px;
    right: 0;
    width: 100%;
    height: 100%;
    transform: translateX(100%);
    opacity: 0;
    transition: all 250ms ease-in-out;
    background-color: var(--white);

    a {
      font-size: 25px;
    }

    &.open {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .icon-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .image-wrapper {
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .burger-menu {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.active {
        span {
          background-color: transparent;

          &:after {
            bottom: 0;
            transform: rotate(45deg);

          }

          &:before {
            top: 0;
            transform: rotate(-45deg);
          }
        }
      }

      span {
        width: 100%;
        height: 2px;
        background-color: var(--black);
        position: relative;


        &:before, &:after {
          content: '';
          width: 100%;
          height: 2px;
          background-color: var(--black);
          position: absolute;
          transition: all 250ms ease-in-out;
        }

        &:after {
          bottom: 8px;
        }

        &:before {
          top: 8px;
        }
      }
    }
  }
}

</style>