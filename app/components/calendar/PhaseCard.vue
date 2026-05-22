<script setup lang="ts">
import type {ParcoursupPhase} from "~/types/parcoursup";
import {formatPhaseRange, getPhaseStatus} from "~/utils/calendar";

const props = defineProps<{
  phase: ParcoursupPhase;
  now: Date;
}>();

const status = computed(() => getPhaseStatus(props.phase, props.now));

const cardClass = computed(() => ({
  "pt-phase-card--active": status.value === "active",
  "pt-phase-card--finished": status.value === "finished",
  "pt-phase-card--unconfirmed": status.value === "date_unconfirmed",
}));
</script>

<template>
  <article class="fr-card pt-phase-card" :class="cardClass">
    <div class="fr-card__body">
      <div class="fr-card__content">
        <div class="pt-phase-meta">
          <StatusBadge :status="status"/>
          <CertaintyBadge :certainty="phase.certainty"/>
        </div>

        <h3 class="fr-card__title">
          {{ phase.title }}
        </h3>

        <p class="fr-card__desc">
          {{ phase.shortDescription }}
        </p>

        <p class="fr-text--sm fr-mb-2w">
          <strong>Dates :</strong> {{ formatPhaseRange(phase) }}
        </p>

        <div v-if="phase.milestones?.length" class="fr-mt-2w">
          <p class="fr-text--sm fr-mb-1w"><strong>Échéances clés</strong></p>
          <ul class="pt-milestone-list fr-text--sm">
            <li v-for="milestone in phase.milestones" :key="milestone.id">
              {{ milestone.title }}
              <span v-if="milestone.displayDate"
              >· {{ milestone.displayDate }}</span
              >
              <span v-if="milestone.shortDescription">
                · {{ milestone.shortDescription }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
