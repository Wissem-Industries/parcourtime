<template>
  <header role="banner" class="fr-header">
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <p class="fr-logo">République<br/>Française</p>
              </div>
            </div>
            <div class="fr-header__service">
              <NuxtLink to="/" title="Accueil - ParcourTime">
                ParcourTime
              </NuxtLink>
              <p class="fr-header__service-tagline">
                Calendrier Parcoursup clair, sourcé et accessible
              </p>
            </div>
          </div>

          <div class="fr-header__tools">
            <div class="fr-header__tools-links">
              <ul class="fr-btns-group">
                <li>
                  <a
                      class="fr-btn fr-btn--tertiary-no-outline"
                      href="https://www.parcoursup.gouv.fr/"
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    Parcoursup officiel
                  </a>
                </li>
                <li>
                  <a class="fr-btn fr-btn--tertiary-no-outline" href="#about">
                    À propos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
