<script setup lang="ts">
import type {Deadline} from "~/types/parcoursup";

const props = defineProps<{
  deadline: Deadline | null;
}>();

const target = computed(() => props.deadline?.date ?? null);
const {remaining} = useCountdown(target);

const items = computed(() => [
  {label: "jours", value: remaining.value.days},
  {label: "heures", value: remaining.value.hours},
  {label: "minutes", value: remaining.value.minutes},
  {label: "secondes", value: remaining.value.seconds},
]);
</script>

<template>
  <section class="pt-hero-panel" aria-labelledby="countdown-title">
    <p class="fr-text--sm fr-mb-1w pt-muted">Prochaine échéance</p>

    <template v-if="deadline">
      <h2 id="countdown-title" class="fr-h3 fr-mb-1w">
        {{ deadline.title }}
      </h2>
      <p class="fr-text--sm fr-mb-3w">
        {{ deadline.displayDate }} · {{ deadline.phaseTitle }}
      </p>

      <div
          class="pt-countdown"
          role="timer"
          aria-live="polite"
          :aria-label="`Temps restant avant ${deadline.title}`"
      >
        <div v-for="item in items" :key="item.label" class="pt-countdown__item">
          <span class="pt-countdown__value">{{ item.value }}</span>
          <span class="pt-countdown__label">{{ item.label }}</span>
        </div>
      </div>
    </template>

    <template v-else>
      <h2 id="countdown-title" class="fr-h3 fr-mb-1w">
        Aucune échéance à venir
      </h2>
      <p class="fr-text--sm fr-mb-0">
        La campagne sélectionnée est terminée ou ses dates ne sont pas encore
        confirmées.
      </p>
    </template>
  </section>
</template>
