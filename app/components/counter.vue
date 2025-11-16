<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import steps, { year_start, results_date, type ParcoursupStep } from '~/composables/useDates'
import { launchConfetti } from '~/utils/confetti'

const now = ref(new Date())
const countdown = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
const progress = ref(0)
const passed = ref(false)

const radius = 6 * 16
const circumference = 2 * Math.PI * radius
const offset = computed(() => circumference * (1 - progress.value / 100))

const currentStep = computed<ParcoursupStep>(() => {
  const step = steps.find(s => now.value >= s.start && now.value < s.end)
  if (step) return step
  // Fallback to last step if no current step
  const lastStep = steps[steps.length - 1]
  if (!lastStep) throw new Error('No steps defined')
  return lastStep
})

const nextStep = computed(() =>
    steps.find(s => s.start > now.value) ?? null
)

// cible utilisée pour le compteur détaillé (jours/heures/etc.)
const targetDate = computed(() => nextStep.value?.start ?? results_date)

// le cercle reste sur "du début de l’année -> résultats"
const updateChart = () => {
  const total = results_date.getTime() - year_start.getTime()
  const elapsed = Math.min(Math.max(now.value.getTime() - year_start.getTime(), 0), total)
  progress.value = (elapsed / total) * 100
}

const updateCountdown = () => {
  const target = targetDate.value
  const diffMs = target.getTime() - now.value.getTime()
  const diff = Math.floor(diffMs / 1000)

  countdown.days = Math.max(0, Math.floor(diff / 86400))
  countdown.hours = Math.max(0, Math.floor((diff % 86400) / 3600))
  countdown.minutes = Math.max(0, Math.floor((diff % 3600) / 60))
  countdown.seconds = Math.max(0, diff % 60)
  countdown.milliseconds = Math.max(0, diffMs % 1000)

  if (diffMs <= 0 && !passed.value) {
    passed.value = true
    launchConfetti(target)
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const startAnimation = () => {
  let currentProgress = 0
  const lerpSpeed = 0.05

  const interval = setInterval(() => {
    now.value = new Date()
    const total = results_date.getTime() - year_start.getTime()
    const elapsed = Math.min(Math.max(now.value.getTime() - year_start.getTime(), 0), total)
    const target = (elapsed / total) * 100

    if (Math.abs(currentProgress - target) < 0.1) {
      currentProgress = target
      progress.value = parseFloat(currentProgress.toFixed(5))
      clearInterval(interval)
    } else {
      currentProgress = lerp(currentProgress, target, lerpSpeed)
      progress.value = parseFloat(currentProgress.toFixed(5))
    }
  }, 10)
}

onMounted(() => {
  updateCountdown()
  updateChart()
  startAnimation()
  setInterval(() => {
    now.value = new Date()
    updateCountdown()
  }, 50)
  setInterval(updateChart, 500)
})
</script>


<template>
  <div class="min-h-screen flex flex-col justify-center items-center md:px-[4em] fade-in">
    <h1 class="mt-4 text-[3em] text-[#000091] font-[Marianne-Bold] text-center">COMPTE À REBOURS</h1>

    <a href="https://www.parcoursup.gouv.fr/" target="_blank" rel="noopener noreferrer"
       class="w-1/3 max-w-[37.5em] min-w-[25em] mt-[2em] md:mt-[0.5em] h-auto object-contain"
       aria-label="Site officiel Parcoursup - Nouvelle fenêtre">
      <img alt="Logo Parcoursup" class="w-full h-full object-contain" src="/Parcoursup_RVB.png" loading="eager"/>
    </a>

    <div class="my-2 text-center" role="status" aria-live="polite">
      <p class="text-[#000091] font-[Marianne-Medium] text-[1.4em]">
        Étape {{ currentStep.step }} · {{ currentStep.title }}
      </p>
      <p v-if="nextStep" class="text-[1.2em] text-gray-500">
        Prochaine échéance : {{ nextStep.title }} –
        {{ nextStep.start.toLocaleDateString('fr-FR') }}
      </p>
    </div>

    <div class="flex flex-col items-center mt-[0.75em] mb-[2em]">
      <div class="relative w-[14em] h-[14em]" :class="{ 'pulse': passed }" role="timer" aria-live="off">
        <svg class="rotate-[-90deg]" height="100%" width="100%" aria-hidden="true">
          <circle class="fill-none stroke-[#d5deff]" cx="50%" cy="50%" r="6em" stroke-width="1.2em" />
          <circle
              :stroke-dasharray="circumference"
              :stroke-dashoffset="offset"
              class="fill-none stroke-[#000091] smooth stroke-[1.2em]"
              cx="50%" cy="50%" r="6em" stroke-linecap="round"
          />
        </svg>
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#000091] text-[1.3em] font-[Marianne-Medium]">
          {{ progress.toFixed(5) }}%
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-[1.5em] justify-center" role="timer" aria-live="polite" aria-label="Temps restant">
      <div
          v-for="(label, key) in { jours: countdown.days, heures: countdown.hours, minutes: countdown.minutes, secondes: countdown.seconds, millisecondes: countdown.milliseconds }"
          :key="key"
          :class="{ 'pulse': passed }"
          class="w-[8em] aspect-square bg-[#dde5ff] border-[0.25em] border-[#000091] p-[1.2em] flex flex-col justify-center items-center text-center shadow-md hover:translate-y-[-0.35em] fade-in-up transition-all"
          :aria-label="`${label} ${key}`">
        <span class="text-[2.2em] text-[#000091] font-[Marianne-Medium] group-hover:text-white" aria-hidden="true">
          {{ label }}
        </span>
        <small class="mt-[0.4em] text-[0.9em] text-[#000091] font-[Marianne-Medium] group-hover:text-white" aria-hidden="true">
          {{ key }}
        </small>
      </div>
    </div>

    <!-- Timeline Parcoursup -->
    <div class="w-full max-w-[72em] mt-[4em] space-y-4 px-4">
      <div
          v-for="step in steps"
          :key="step.id"
          class="flex flex-col md:flex-row gap-4 border rounded-lg p-4 shadow-sm hover:translate-y-[-0.35em] transition-all"
          :style="{
          borderLeftWidth: '6px',
          borderLeftColor: step.color,
          backgroundColor: step.id === currentStep.id ? '#ecf0ff' : '#ffffff'
        }"
      >
        <div class="text-[2.2em] font-[Marianne-Bold] mr-4 text-[#000091]">
          Étape {{ step.step }}
        </div>
        <div>
          <p class="text-[0.85em] text-gray-500">
            {{ step.start.toLocaleDateString('fr-FR') }} → {{ step.end.toLocaleDateString('fr-FR') }}
          </p>
          <p class="text-[1.1em] font-[Marianne-Medium] text-[#000091]">
            {{ step.title }}
          </p>
          <p class="text-[0.9em] text-gray-700">
            {{ step.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <footer
        class="w-full max-w-[72em] py-4 my-4 mx-[10em] bg-[#f4f4f9] text-center text-[#000091] font-[Marianne-Medium]">
      <p class="text-[0.9em]">&copy; 2025 Made with ❤ by <a class="hover:underline" href="https://www.wissem.pro/"
                                                            target="_blank" rel="noopener noreferrer">Wissem.</a></p>
      <p class="text-[0.75em]"><a class="hover:underline" href="https://www.parcoursup.gouv.fr/" target="_blank" rel="noopener noreferrer">Parcoursup</a>®
        est une marque déposée propriété de l'État français.</p>
    </footer>
  </div>
</template>


<style scoped>
footer p:nth-child(2) {
  font-size: 0.75em;
  color: #888;
}

.fade-in {
  opacity: 0;
  transform: translateY(50px);
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>