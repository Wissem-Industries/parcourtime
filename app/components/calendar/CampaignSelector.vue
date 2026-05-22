<script setup lang="ts">
import type {Campaign} from "~/types/parcoursup";

defineProps<{
  campaigns: Campaign[];
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <div class="fr-select-group">
    <label class="fr-label" for="campaign-select">
      Campagne Parcoursup
      <span class="fr-hint-text">Les dates sont versionnées par année.</span>
    </label>
    <select
        id="campaign-select"
        class="fr-select"
        name="campaign"
        :value="modelValue"
        @change="
        emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option
          v-for="campaign in campaigns"
          :key="campaign.id"
          :value="campaign.id"
      >
        {{ campaign.label }}
      </option>
    </select>
  </div>
</template>
