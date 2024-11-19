import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DetailsView from "@/views/DetailsView.vue";
import CartView from "@/views/CartView.vue";
import AdminView from "@/views/AdminView.vue";
import UserView from "@/views/UserView.vue";
import CheckoutLayout from "@/views/checkout/CheckoutLayout.vue";
import PersonalData from "@/views/checkout/PersonalData.vue";
import DeliveryAddress from "@/views/checkout/DeliveryAddress.vue";
import PaymentSummary from "@/views/checkout/PaymentSummary.vue";
import ConfirmOrder from "@/views/checkout/ConfirmOrder.vue";
import ContactView from "@/views/ContactView.vue";
import AboutView from "@/views/AboutView.vue";
import FaqView from "@/views/FaqView.vue";
import LoginView from "@/views/LoginView.vue";
import Registrieren from "@/views/Registrieren.vue";
import {useUserStore} from "@/stores/userStore";
import UserData from "@/views/UserData.vue";
import UserOrders from "@/views/UserOrders.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/kontakt',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/ueber',
      name: 'about',
      component: AboutView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registrieren',
      name: 'register',
      component: Registrieren
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqView
    },
    {
      path: '/details/:id',
      name: 'details',
      component: DetailsView,
      props: true
    },
    {
      path: '/warenkorb',
      name: 'cart',
      component: CartView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {requiresAuth: true, isAdmin: true}
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {requiresAuth: true},
      children: [
        {
          path: '',
          name: 'user-data',
          component: UserData
        },
        {
          path: 'orders',
          name: 'user-orders',
          component: UserOrders
        }
      ]
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutLayout,
      children: [
        {
          path: '',
          redirect: { name: 'personal-data' }
        },
        {
          path: 'persoenliche-daten',
          name: 'personal-data',
          component: PersonalData
        },
        {
          path: 'lieferadresse',
          name: 'delivery-data',
          component: DeliveryAddress
        },
        {
          path: 'zahlung',
          name: 'payment',
          component: PaymentSummary
        },
        {
          path: 'danke',
          name: 'order-confirmation',
          component: ConfirmOrder
        }
      ]
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      const element = document.querySelector(to.hash);
      if (element) {
        return {
          el: element,
          behavior: 'smooth'
        };
      }
    } else {
      return { top: 0, left: 0, behavior: "smooth" }
    }
  },
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'

})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Blockiere die Navigation, bis die Auth-Überprüfung abgeschlossen ist
  if (!userStore.isLoaded) {
    await userStore.fetchUser(); // Warten, bis die Benutzerinformationen geladen sind
  }

  // Prüfen, ob Authentifizierung erforderlich ist
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ name: 'login' });
  }

  // Prüfen, ob Adminrechte erforderlich sind
  if (to.meta.isAdmin && !userStore.isAdmin) {
    return next({ name: 'login' });
  }

  next(); // Navigation erlauben
});



export default router
