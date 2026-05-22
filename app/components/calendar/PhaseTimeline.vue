<script setup lang="ts">
import type {Campaign} from "~/types/parcoursup";
import {sortPhases} from "~/utils/calendar";

const props = defineProps<{
  campaign: Campaign;
  now: Date;
}>();

const phases = computed(() => sortPhases(props.campaign.phases));
</script>

<template>
  <div class="pt-phase-grid">
    <PhaseCard
        v-for="phase in phases"
        :key="phase.id"
        :phase="phase"
        :now="now"
    />
  </div>
</template>
