<script setup lang="ts">
import type { Deadline } from '~/types/parcoursup'

const props = defineProps<{
  deadline: Deadline | null
  now: Date
  live: boolean
}>()

const items = computed(() => {
  const remaining = splitDuration(
    props.deadline ? props.deadline.date.getTime() - props.now.getTime() : 0,
  )
  const show = (value: number) => (props.live ? String(value) : '–')
  return [
    { label: 'jours', value: show(remaining.days) },
    { label: 'heures', value: show(remaining.hours) },
    { label: 'minutes', value: show(remaining.minutes) },
    { label: 'secondes', value: show(remaining.seconds) },
  ]
})
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
