import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import CookieDataConsent from 'src/../data/cookie.json';

export const config: CookieConsentConfig = {
  revision: 1,
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom right'
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false
    }
  },
  categories: {
    necessary: {
      readOnly: true
    },
    functionality: {},
    analytics: {
      services: {
        ga4: {
          label:
            '<a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank">Google Analytics 4 (dummy)</a>',
          onAccept: () => {},
          onReject: () => {},
          cookies: [
            {
              name: /^_ga/
            }
          ]
        },
        another: {
          label: 'Another one (dummy)'
        }
      }
    }
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: CookieDataConsent
  }
};
