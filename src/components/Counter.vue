<script lang="ts" setup>
import {eDate, sDate} from '../main'
import {computed, onMounted, reactive, ref} from 'vue'
import {launchConfetti} from "./Confetti.ts";

const date = eDate
const startDate = sDate

const countdown = reactive({days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0})
const progress = ref(0)
const passed = ref(false)
const radius = 6 * 16
const circumference = 2 * Math.PI * radius
const offset = computed(() => circumference * (1 - progress.value / 100))

const updateCountdown = () => {
  const now = new Date().getTime()
  const diff = Math.floor((date.getTime() - now) / 1000)
  countdown.days = Math.max(0, Math.floor(diff / 86400))
  countdown.hours = Math.max(0, Math.floor((diff % 86400) / 3600))
  countdown.minutes = Math.max(0, Math.floor((diff % 3600) / 60))
  countdown.seconds = Math.max(0, diff % 60)
  countdown.milliseconds = Math.max(0, (date.getTime() - now) % 1000)

  if ((date.getTime() < new Date().getTime()) && !passed.value) {
    passed.value = true
    launchConfetti(eDate)
  }
}

const updateChart = () => {
  const now = new Date().getTime()
  const total = date.getTime() - startDate.getTime()
  const elapsed = Math.min(Math.max(now - startDate.getTime(), 0), total)

  progress.value = (elapsed / total) * 100
}

const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

const startAnimation = () => {
  let currentProgress = 0
  const lerpSpeed = 0.05
  let targetProgress = progress.value

  const interval = setInterval(() => {
    const now = new Date().getTime()
    const total = date.getTime() - startDate.getTime()
    const elapsed = Math.min(Math.max(now - startDate.getTime(), 0), total)

    targetProgress = (elapsed / total) * 100

    if (Math.abs(currentProgress - targetProgress) < 0.1) {
      currentProgress = targetProgress
      clearInterval(interval)
    } else {
      currentProgress = lerp(currentProgress, targetProgress, lerpSpeed)
      progress.value = parseFloat(currentProgress.toFixed(5))
    }
  }, 1)
}

onMounted(() => {
  updateCountdown()
  updateChart()
  startAnimation()
  setInterval(updateCountdown, 10)
  setTimeout(() => {
    setInterval(updateChart, 10)
  }, 1000)
});
</script>


<template>
  <div class="min-h-screen flex flex-col justify-center items-center md:px-[4em] fade-in">
    <h1 class="text-[2.5em] text-[#000091] font-[Marianne-Bold] text-center">TEMPS AVANT LES RÉSULTATS</h1>

    <a href="https://www.parcoursup.gouv.fr/" target="_blank"
       class="w-1/2 max-w-[37.5em] min-w-[25em] mt-[2em] md:mt-[0.5em] h-auto object-contain">
      <img alt="Logo" class="w-full h-full object-contain" src="/Parcoursup_RVB.png"/>
    </a>

    <div class="flex flex-col items-center mt-[0.75em] mb-[2em]">
      <div class="relative w-[14em] h-[14em]" :class="{'pulse': passed}">
        <svg class="rotate-[-90deg]" height="100%" width="100%">
          <circle class="fill-none stroke-[#d5deff]" cx="50%" cy="50%" r="6em" stroke-width="1.2em"/>
          <circle
              :stroke-dasharray="circumference"
              :stroke-dashoffset="offset"
              class="fill-none stroke-[#000091] smooth stroke-[1.2em]" cx="50%" cy="50%"
              r="6em"
              stroke-linecap="round"
          />
        </svg>
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#000091] text-[1.3em] font-[Marianne-Medium]">
          {{ progress.toFixed(5) }}%
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-[1.5em] justify-center">
      <div
          v-for="(label, key) in { jours: countdown.days, heures: countdown.hours, minutes: countdown.minutes, secondes: countdown.seconds, millisecondes: countdown.milliseconds }"
          :key="key"
          :class="{'pulse': passed}"
          class="w-[8em] aspect-square bg-[#dde5ff] border-[0.25em] border-[#000091] p-[1.2em] flex flex-col justify-center items-center text-center shadow-md transition-all hover:-translate-y-[0.3em] hover:bg-[#1212ff] hover:text-white fade-in-up">
        <span class="text-[2.2em] text-[#000091] font-[Marianne-Medium] group-hover:text-white">
          {{ label }}
        </span>
        <small class="mt-[0.4em] text-[0.9em] text-[#000091] font-[Marianne-Medium] group-hover:text-white">
          {{ key }}
        </small>
      </div>
    </div>

    <footer
        class="w-full max-w-[72em] py-4 mt-[6em] mx-[10em] bg-[#f4f4f9] text-center text-[#000091] font-[Marianne-Medium]">
      <p class="text-[0.9em]">&copy; 2025 Made with ❤ by <a class="hover:underline" href="https://github.com/WissemBad"
                                                            target="_blank">Wissem.</a></p>
      <p class="text-[0.75em]"><a class="hover:underline" href="https://www.parcoursup.gouv.fr/" target="_blank">Parcoursup</a>®
        est une marque déposée propriété de l’État français.</p>
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