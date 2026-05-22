<script setup lang="ts">
import type {Campaign} from "~/types/parcoursup";
import {campaigns, defaultCampaignId, getCampaignById,} from "~/data/parcoursup/campaigns";
import {
  formatPhaseRange,
  getCampaignProgress,
  getCurrentPhase,
  getNextDeadline,
  getPhaseStatus,
  hasUnconfirmedDates,
} from "~/utils/calendar";

const selectedCampaignId = ref(defaultCampaignId);
const fallbackCampaign = campaigns[0] as Campaign;
const campaignOptions = campaigns as Campaign[];
const selectedCampaign = computed(
    () => getCampaignById(selectedCampaignId.value) ?? fallbackCampaign,
);

const clockTarget = computed<Date | null>(() => null);
const {now} = useCountdown(clockTarget);

const currentPhase = computed(() =>
    getCurrentPhase(selectedCampaign.value, now.value),
);
const nextDeadline = computed(() =>
    getNextDeadline(selectedCampaign.value, now.value),
);
const campaignProgress = computed(() =>
    getCampaignProgress(selectedCampaign.value, now.value),
);
const animatedCampaignProgress = ref(0);
const campaignProgressLabel = computed(() =>
    campaignProgress.value === null
        ? null
        : campaignProgress.value.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
);
const hasDatesToConfirm = computed(() =>
    hasUnconfirmedDates(selectedCampaign.value),
);
const currentStatus = computed(() =>
    currentPhase.value
        ? getPhaseStatus(currentPhase.value, now.value)
        : "outside_calendar",
);

watch(
    campaignProgress,
    (progress) => {
      if (progress === null) {
        animatedCampaignProgress.value = 0;
        return;
      }

      if (!import.meta.client) return;

      requestAnimationFrame(() => {
        animatedCampaignProgress.value = progress;
      });
    },
    {immediate: true},
);

useSeoMeta({
  title: () => `ParcourTime - ${selectedCampaign.value.label}`,
  description: () =>
      `Compte à rebours et calendrier sourcé des phases Parcoursup pour ${selectedCampaign.value.label}.`,
  ogTitle: () => `ParcourTime - ${selectedCampaign.value.label}`,
  ogDescription: () =>
      "Suivez les grandes échéances Parcoursup avec des dates centralisées, sourcées et faciles à vérifier.",
  ogImage: "/Parcoursup_Banner.jpg",
  ogUrl: "https://parcourtime.wissem.pro",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="pt-page">
    <div class="pt-affiliation-banner" role="note">
      <div class="fr-container">
        Ce site n’est pas affilié à Parcoursup. Vérifiez toujours les
        informations importantes sur le site officiel.
      </div>
    </div>

    <AppHeader/>

    <main id="content">
      <section class="pt-hero">
        <div class="fr-container">
          <div class="pt-toolbar fr-mb-4w">
            <div>
              <h1 class="fr-display--xs fr-mb-1w">
                Le calendrier Parcoursup, lisible au premier coup d’œil
              </h1>
              <p class="fr-text--lg fr-mb-0">
                ParcourTime suit les phases officielles, affiche la phase en
                cours et met en avant la prochaine échéance importante.
              </p>
            </div>

            <CampaignSelector
                v-model="selectedCampaignId"
                :campaigns="campaignOptions"
            />
          </div>

          <div
              v-if="hasDatesToConfirm"
              class="fr-alert fr-alert--warning fr-mb-4w"
          >
            <h2 class="fr-alert__title">Certaines dates restent à confirmer</h2>
            <p>
              Les campagnes futures sont affichées sans inventer de calendrier.
              Les dates seront ajoutées uniquement après publication officielle.
            </p>
          </div>

          <div class="pt-hero-grid">
            <section
                class="pt-hero-panel"
                aria-labelledby="current-phase-title"
            >
              <p class="fr-text--sm fr-mb-1w pt-muted">Phase actuelle</p>
              <div class="pt-phase-meta">
                <StatusBadge :status="currentStatus"/>
              </div>

              <template v-if="currentPhase">
                <h2 id="current-phase-title" class="fr-h2 fr-mb-1w">
                  {{ currentPhase.title }}
                </h2>
                <p class="fr-text--lg">
                  {{ currentPhase.shortDescription }}
                </p>
                <p class="fr-text--sm fr-mb-3w">
                  <strong>Dates :</strong> {{ formatPhaseRange(currentPhase) }}
                </p>
              </template>

              <template v-else>
                <h2 id="current-phase-title" class="fr-h2 fr-mb-1w">
                  Aucune phase active
                </h2>
                <p class="fr-text--lg">
                  La campagne est hors calendrier ou ses dates ne sont pas
                  encore confirmées.
                </p>
              </template>

              <div
                  v-if="
                  campaignProgress !== null && campaignProgressLabel !== null
                "
                  class="pt-progress-card fr-mt-4w"
                  :aria-label="`Progression du calendrier Parcoursup : ${campaignProgressLabel} pour cent`"
              >
                <div class="pt-progress-card__header">
                  <p class="fr-text--sm fr-mb-0">Progression du calendrier</p>
                  <strong>{{ campaignProgressLabel }} %</strong>
                </div>

                <div
                    class="pt-progress"
                    role="progressbar"
                    :aria-valuenow="Number(campaignProgress.toFixed(5))"
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                  <div
                      class="pt-progress__bar"
                      :style="{ width: `${animatedCampaignProgress}%` }"
                  />
                </div>

                <p class="fr-text--sm fr-mt-2w fr-mb-0">
                  Avancement entre le début du calendrier et la fin de la
                  campagne sélectionnée.
                </p>
              </div>
            </section>

            <CountdownDisplay :deadline="nextDeadline"/>
          </div>
        </div>
      </section>

      <section class="pt-section" aria-labelledby="timeline-title">
        <div class="fr-container">
          <div
              class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-3w"
          >
            <div class="fr-col-12 fr-col-md-8">
              <h2 id="timeline-title" class="fr-h2 fr-mb-1w">
                Calendrier complet
              </h2>
              <p class="fr-text--lg fr-mb-0">
                Les phases sont triées chronologiquement, avec un état visuel
                clair pour distinguer ce qui est passé, actif ou à venir.
              </p>
            </div>
          </div>

          <PhaseTimeline :campaign="selectedCampaign" :now="now"/>
        </div>
      </section>

      <section
          id="about"
          class="pt-section pt-section--muted"
          aria-labelledby="about-title"
      >
        <div class="fr-container">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12 fr-col-md-7">
              <h2 id="about-title" class="fr-h2">Parcoursup, c’est quoi ?</h2>
              <p class="fr-text--lg">
                Parcoursup est la plateforme nationale de préinscription en
                première année de l’enseignement supérieur en France. Elle
                centralise un dossier, un calendrier et les propositions
                d’admission des formations.
              </p>
              <p class="fr-mb-0">
                Ce site ne remplace pas votre dossier Parcoursup : il sert à
                rendre les grandes échéances plus faciles à suivre.
              </p>
            </div>

            <div class="fr-col-12 fr-col-md-5">
              <div class="fr-callout">
                <h3 class="fr-callout__title">Sources officielles</h3>
                <p class="fr-callout__text">
                  Les dates de la campagne sélectionnée sont centralisées dans
                  une source typée et associées à des liens officiels.
                </p>
                <ul class="pt-source-list">
                  <li
                      v-for="source in selectedCampaign.sources"
                      :key="source.id"
                  >
                    <a
                        class="fr-link"
                        :href="source.url"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      {{ source.title }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter :campaign="selectedCampaign"/>
  </div>
</template>
