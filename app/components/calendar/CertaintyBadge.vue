<script setup lang="ts">
import {DsfrBadge} from "@gouvminint/vue-dsfr";
import type {DateCertainty} from "~/types/parcoursup";

const props = defineProps<{
  certainty: DateCertainty;
}>();

const badge = computed(() => {
  switch (props.certainty) {
    case "official":
      return {label: "Source officielle", type: "success" as const};
    case "past_official":
      return {label: "Campagne passée", type: "info" as const};
    case "estimated":
      return {label: "Période indicative", type: "warning" as const};
    case "to_confirm":
      return {label: "À confirmer", type: "warning" as const};
    default:
      return {label: "À vérifier", type: "error" as const};
  }
});
</script>

<template>
  <DsfrBadge :label="badge.label" :type="badge.type" small/>
</template>
