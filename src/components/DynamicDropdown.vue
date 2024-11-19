<template>
  <div
      tabindex="0"
      class="dropdown-wrapper"
      :aria-expanded="showOptions"
      :aria-activedescendant="highlightedIndex !== null ? 'option-' + highlightedIndex : undefined"
      @keydown="handleKeyboard"
  >
    <div @click="toggleOptions" class="selected-option">
      <p>{{ selectedLabel || 'Land auswählen' }}</p>
      <div class="icon-wrapper">
        <img :src="getImage('ic_chevron_bottom.png')" alt="">
      </div>
    </div>
    <div
        v-if="showOptions"
        class="selectable-options"
        role="listbox"
        :aria-hidden="!showOptions"
    >
      <p
          v-for="(option, index) in options"
          :id="'option-' + index"
          :key="option.value"
          @click="selectOption(option)"
          role="option"
          :class="{ 'highlighted': index === highlightedIndex || option.value === selectedOption }"
          :aria-selected="option.value === selectedOption"
      >
        {{ option.label }}
      </p>
    </div>
    <p v-if="userError" class="error">{{userError}}</p>
  </div>

</template>

<script setup lang="ts">
import {ref, type Ref, defineModel, watch, type ModelRef} from "vue";
import {getImage} from "@/utils/ImageUtils";

interface Option {
  label: string;
  value: string;
}


const selectedOption = defineModel<string>('selectedOption', {
  required: true
})

const userError: ModelRef<string| undefined> = defineModel('userError')

const { options } = defineProps<{ options: Option[] }>();
const showOptions = ref(false);
const selectedLabel: Ref<string | null> = ref(null);
const highlightedIndex = ref<number | null>(null);

watch(() => selectedOption.value, (newValue) => {
      const selected = options.find(option => option.value === newValue);
      if (selected) {
        selectedLabel.value = selected.label;
      }
    },
    { immediate: true }
)

function toggleOptions() {
  showOptions.value = !showOptions.value;
  if (showOptions.value) {
    highlightedIndex.value = null;
  }
}

function selectOption(option: Option) {
  selectedOption.value = option.value;
  selectedLabel.value = option.label;
  showOptions.value = false;
  highlightedIndex.value = null;
}

function handleKeyboard(event: KeyboardEvent) {
  if (event.key === 'Enter' && !showOptions.value) {
    toggleOptions();
    return;
  }

  if (!showOptions.value) return;

  const optionsCount = options.length;

  switch (event.key) {
    case 'ArrowDown':
      highlightedIndex.value =
          (highlightedIndex.value === null ? 0 : (highlightedIndex.value + 1) % optionsCount);
      break;

    case 'ArrowUp':
      highlightedIndex.value =
          (highlightedIndex.value === null ? optionsCount - 1 : (highlightedIndex.value - 1 + optionsCount) % optionsCount);
      break;

    case 'Enter':
      if (highlightedIndex.value !== null) {
        selectOption(options[highlightedIndex.value]);
      }
      break;

    case 'Escape':
      showOptions.value = false;
      highlightedIndex.value = null;
      break;
  }
}

</script>

<style scoped>
p {
  margin: 0;
}

.dropdown-wrapper {
  position: relative;

  &:focus {
    outline: 1px solid black;
    box-sizing: border-box;
  }

  .selected-option {
    box-sizing: border-box;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    cursor: pointer;
    height: 50px;

    p {
      font-size: 18px;
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .selectable-options {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid black;
    position: absolute;
    top: 55px;
    width: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 10;
    background-color: var(--white);

    p {
      box-sizing: border-box;
      padding: 5px;
      &:hover,
      &.highlighted {
        background-color: lightgrey;
      }
    }
  }

  .error {
    text-align: right;
    color: red;
  }
}
</style>