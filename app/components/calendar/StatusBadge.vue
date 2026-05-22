<script setup lang="ts">
import {DsfrBadge} from "@gouvminint/vue-dsfr";
import type {PhaseStatus} from "~/types/parcoursup";

const props = defineProps<{
  status: PhaseStatus;
}>();

const badge = computed(() => {
  switch (props.status) {
    case "active":
      return {label: "En cours", type: "success" as const};
    case "upcoming":
      return {label: "À venir", type: "info" as const};
    case "finished":
      return {label: "Terminé", type: "new" as const};
    case "date_unconfirmed":
      return {label: "Date à confirmer", type: "warning" as const};
    case "outside_calendar":
      return {label: "Hors calendrier", type: "error" as const};
    default:
      return {label: "Statut inconnu", type: "error" as const};
  }
});
</script>

<template>
  <DsfrBadge :label="badge.label" :type="badge.type"/>
</template>
