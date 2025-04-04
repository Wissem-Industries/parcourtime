<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref} from 'vue'

const date = new Date("20245x-0a6-02T08:00:00Z")
const startDate = new Date("2025-04-02T00:00:00Z")

const countdown = reactive({days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0})
const progress = ref(0)

const radius = 60
const circumference = 2 * Math.PI * radius
const offset = computed(() => circumference * (1 - progress.value / 100))

const updateCountdown = () => {
  const now = new Date().getTime()
  const total = date.getTime() - startDate.getTime()
  const elapsed = Math.min(Math.max(now - startDate.getTime(), 0), total)

  progress.value = Math.min(Math.max((elapsed / total) * 100, 0), 100)

  const diff = Math.floor((date.getTime() - now) / 1000)
  countdown.days = Math.max(0, Math.floor(diff / 86400))
  countdown.hours = Math.max(0, Math.floor((diff % 86400) / 3600))
  countdown.minutes = Math.max(0, Math.floor((diff % 3600) / 60))
  countdown.seconds = Math.max(0, diff % 60)
  countdown.milliseconds = Math.max(0, (date.getTime() - now) % 1000)
}

updateCountdown()
let interval: number | null = null
onMounted(() => {
  interval = window.setInterval(updateCountdown, 10)
})
onUnmounted(() => {
  if (interval !== null) clearInterval(interval)
})
</script>

<template>
  <div class="counter-wrapper">
    <h1 class="title">TEMPS AVANT LES RÉSULTATS</h1>
    <img src="/Parcoursup_RVB.png" alt="Logo" class="logo"/>
    <div class="countdown">
      <div class="time-box"><span>{{ countdown.days }}</span><small>jours</small></div>
      <div class="time-box"><span>{{ countdown.hours }}</span><small>heures</small></div>
      <div class="time-box"><span>{{ countdown.minutes }}</span><small>minutes</small></div>
      <div class="time-box"><span>{{ countdown.seconds }}</span><small>secondes</small></div>
      <div class="time-box"><span>{{ countdown.milliseconds }}</span><small>millisecondes</small></div>
    </div>
    <div class="progress-container">
      <h3 class="subtitle">POURCENTAGE D'AVANCEMENT</h3>
      <div class="progress-ring-wrapper">
        <svg class="progress-ring" width="160" height="160">
          <circle class="bg" cx="80" cy="80" r="60"/>
          <circle
              class="progress"
              cx="80"
              cy="80"
              r="60"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="offset"
          />
        </svg>
        <div class="percentage-overlay">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 50%;
  max-width: 600px;
  min-width: 400px;
  height: auto;
  margin-bottom: 2rem;
  object-fit: contain;
}

.counter-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Marianne', sans-serif;
  text-align: center;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  font-family: 'Marianne-Bold', sans-serif;
  color: var(--blue-france-main);
  font-weight: bold;
  margin-bottom: 2rem;
}

.subtitle {
  font-size: 1.5rem;
  font-family: 'Marianne-Medium', sans-serif;
  color: var(--blue-france-main);
  margin-top: 2rem;
}

.countdown {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.time-box {
  background-color: var(--box-light);
  border: 4px solid var(--box-border);
  padding: 1.2rem 1rem;
  width: 100px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.time-box:hover {
  transform: translateY(-5px);
  background-color: var(--blue-france-hover);
  color: white;
}

.time-box span {
  font-size: 2rem;
  color: var(--blue-france-main);
  font-family: 'Marianne-Medium', sans-serif;
  display: block;
}

.time-box:hover span {
  color: white;
}

.time-box small {
  font-size: 0.9rem;
  color: var(--blue-france-main);
  display: block;
  margin-top: 0.4rem;
}

.time-box:hover small {
  color: white;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Marianne', sans-serif;
  margin-top: 2rem;
}

.progress-ring {
  transform: rotate(-90deg);
}

.bg {
  fill: none;
  stroke: #d5deff;
  stroke-width: 12;
}

.label {
  margin-top: 1rem;
  color: #000091;
  font-size: 1rem;
  text-align: center;
}

.progress {
  fill: none;
  stroke: #000091; /* Bleu France */
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.percentage-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000091; /* Bleu France */
  font-size: 1.5rem;
  font-weight: bold;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Marianne', sans-serif;
}

.progress-ring-wrapper {
  position: relative;
  width: 160px;
  height: 160px;
}

</style>
