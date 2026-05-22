<script setup lang="ts">
import type {Campaign} from "~/types/parcoursup";

defineProps<{
  campaign: Campaign;
}>();
</script>

<template>
  <footer class="fr-footer" role="contentinfo">
    <div class="fr-container">
      <div class="fr-footer__body">
        <div class="fr-footer__brand fr-enlarge-link">
          <p class="fr-logo">République<br/>Française</p>
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc pt-footer-note">
            ParcourTime est un projet indépendant, non officiel. Les dates sont
            reprises depuis les sources institutionnelles indiquées et doivent
            toujours être vérifiées sur Parcoursup en cas de doute.
          </p>
          <p class="fr-text--sm fr-mb-0">
            Dernière mise à jour des données : {{ campaign.lastUpdated }}.
          </p>
        </div>
      </div>

      <div class="fr-footer__bottom pt-footer-bottom">
        <ul class="fr-footer__bottom-list pt-footer-links">
          <li>
            <a
                class="fr-footer__bottom-link"
                href="https://www.parcoursup.gouv.fr/"
                target="_blank"
                rel="noopener noreferrer"
            >
              Parcoursup
            </a>
          </li>
          <li>
            <a
                class="fr-footer__bottom-link"
                href="https://www.parcoursup.gouv.fr/calendrier"
                target="_blank"
                rel="noopener noreferrer"
            >
              Calendrier officiel
            </a>
          </li>
          <li>
            <a
                class="fr-footer__bottom-link pt-footer-signature"
                href="https://www.wissem.pro/"
                target="_blank"
                rel="noopener noreferrer"
            >
              Made by Wissem with &lt;3
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
