<template>
  <div class="site-wrapper">
    <div class="progress-wrapper">
      <div class="steps-wrapper">
        <div
            v-for="(step, index) in steps"
            :key="step.routeName"
            :class="['step', { active: index <= currentStep, clickable: isStepClickable(index) }]"
            @click="goToStep(index)"
        >
          <p class="step-number">{{ index + 1 }}</p>
          <p class="step-name">{{ step.name }}</p>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth }"></div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="component"></component>
    </router-view>

    <div class="button-section">
      <DynamicButton
          v-if="currentStep < steps.length - 2 && currentStep < steps.length - 1"
          @click="validate"
          button-text="Weiter"/>
      <DynamicButton
          v-if="currentStep < steps.length - 1"
          @click="goBack"
          :button-type="ButtonType.Secondary"
          button-text="Zurück"/>
      <DynamicButton
          v-if="currentStep === steps.length - 1"
          @click="clearLocalStorageData"
          :is-router-link="true"
          :route="{pathName: SiteLinks.Home}"
          button-text="Zurück zur Startseite"/>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DynamicButton from "@/components/DynamicButton.vue";
import { ButtonType } from "@/enums/ButtonType";
import {SiteLinks} from "@/enums/SiteLinks";
import {useCartStore} from "@/stores/cartStore";
import {useCheckoutStore} from "@/stores/checkoutStore";

interface ValidatableComponent {
  validateInputFields: () => boolean;
}

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

function clearLocalStorageData() {
  cartStore.clearCartData()
  checkoutStore.clearUserData()
  localStorage.clear()
}

const router = useRouter();
const route = useRoute();

const component = ref<ValidatableComponent | null>(null);

// Schritte und Status
const steps = [
  { name: 'Persönliche Daten', routeName: 'personal-data' },
  { name: 'Lieferadresse', routeName: 'delivery-data' },
  { name: 'Zahlung', routeName: 'payment' },
  { name: 'Danke', routeName: 'order-confirmation' }
];

const validatedSteps = ref<boolean[]>(Array(steps.length).fill(false)); // Alle Schritte nicht validiert

const currentStep = computed(() => {
  return steps.findIndex(step => step.routeName === route.name);
})


const progressWidth = computed(() => {
  if (currentStep.value === -1) return '0%';
  return (currentStep.value / (steps.length - 1)) * 100 + '%';
})

function validate() {
  if (!component.value?.validateInputFields()) {
    return;
  }

  for (let i = 0; i <= currentStep.value; i++) {
    validatedSteps.value[i] = true;
  }

  if (currentStep.value < steps.length - 1) {
    router.push({ name: steps[currentStep.value + 1].routeName });
  }
}

function goBack() {
  if (currentStep.value > 0) {
    router.push({ name: steps[currentStep.value - 1].routeName });
  }
}

function goToStep(index: number) {
  if (isStepClickable(index)) {
    router.push({ name: steps[index].routeName });
  }
}

function isStepClickable(index: number): boolean {
  const firstNonValidatedStep = validatedSteps.value.findIndex(validated => !validated);
  return validatedSteps.value[index] || index <= firstNonValidatedStep;
}

</script>



<style scoped>

.progress-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  position: relative;

  .progress-bar {
    background-color: lightgray;
    width: 100%;
    height: 10px;
    position: absolute;
    border-radius: 8px;
    z-index: -1;
    overflow: hidden;

    .progress {
      height: inherit;
      background-color: var(--black);
      transition: all 250ms ease-in-out;
    }
  }

  .steps-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .step {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25px;
      width: 25px;
      border: 1px solid var(--black);
      border-radius: 50%;
      position: relative;
      background-color: var(--white);
      cursor: pointer;

      &.active {
        background-color: var(--black);

        .step-number {
          color: var(--white)
        }

      }

      .step-name {
        position: absolute;
        top: 110%;
        font-size: 10px;
        text-align: center;
      }

    }
  }
}

.button-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>