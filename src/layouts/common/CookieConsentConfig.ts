import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import { GOOGLE_TAG_MANAGER_ID } from 'astro:env/client';

export const CAT_NECESSARY = 'necessary';
export const CAT_ANALYTICS = 'analytics';
export const CAT_MARKETING = 'marketing';
export const CAT_ADVERTISEMENT = 'advertisement';
export const CAT_FUNCTIONALITY = 'functionality';
export const CAT_SECURITY = 'security';
export const SERVICE_AD_STORAGE = 'ad_storage';
export const SERVICE_AD_USER_DATA = 'ad_user_data';
export const SERVICE_AD_PERSONALIZATION = 'ad_personalization';
export const SERVICE_ANALYTICS_STORAGE = 'analytics_storage';
export const SERVICE_FUNCTIONALITY_STORAGE = 'functionality_storage';
export const SERVICE_PERSONALIZATION_STORAGE = 'personalization_storage';
export const SERVICE_SECURITY_STORAGE = 'security_storage';

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
    _gtmLoaded?: boolean;
  }
}

function loadGTM() {
  // Only load GTM once
  if (window._gtmLoaded) return;
  window._gtmLoaded = true;

  (function (w: any, d: Document, s: string, l: string, i: string) {
    w[l] = w[l] || []; w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s) as HTMLScriptElement, dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f?.parentNode?.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GOOGLE_TAG_MANAGER_ID);
}

function updateGtagConsent(cookie: CookieConsent.CookieValue) {
  const hasAnalytics = cookie.categories?.includes(CAT_ANALYTICS);
  const hasMarketing = cookie.categories?.includes(CAT_MARKETING);
  const hasFunctionality = cookie.categories?.includes(CAT_FUNCTIONALITY);

  window.gtag?.('consent', 'update', {
    [SERVICE_AD_STORAGE]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_AD_USER_DATA]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_AD_PERSONALIZATION]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_ANALYTICS_STORAGE]: hasAnalytics ? 'granted' : 'denied',
    [SERVICE_PERSONALIZATION_STORAGE]: hasFunctionality ? 'granted' : 'denied'
  });

  // Load GTM if analytics consent is granted
  if (hasAnalytics) {
    loadGTM();
  }
}

export const config: CookieConsentConfig = {
  root: '#cc-container',
  onFirstConsent: ({ cookie }) => updateGtagConsent(cookie),
  onConsent: ({ cookie }) => updateGtagConsent(cookie),
  onChange: ({ cookie }) => updateGtagConsent(cookie),
  revision: 5,
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
    marketing: {},
    functionality: {
      enabled: true
    },
    analytics: {
      enabled: true,
      services: {
        ga4: {
          label:
            '<a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank">Google Analytics 4</a>',
          cookies: [
            {
              name: /^_ga/
            }
          ]
        }
      }
    }
  },
  language: {
    default: 'en',
    autoDetect: 'document',
    translations: {
      en: {
        // See: https://support.google.com/tagmanager/answer/10718549?hl=en
        consentModal: {
          title: 'We use cookies',
          description:
            'This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
          acceptAllBtn: 'Accept all',
          showPreferencesBtn: 'Manage Individual preferences'
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Accept all',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          sections: [
            {
              title: 'Cookie usage',
              description:
                'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.'
            },
            {
              title: 'Strictly necessary cookies',
              description:
                'These cookies are essential for the proper functioning of the website, for example for user authentication.',
              linkedCategory: CAT_NECESSARY
            },
            {
              title: 'Analytics',
              description:
                'Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user\'s experience.',
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Expires after 12 days'
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Session'
                  }
                ]
              }
            },
            {
              title: 'Advertisement Cookies',
              description:
                'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href="https://g.co/adsettings">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Advertising',
              description:
                'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href="https://g.co/adsettings">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Functionality',
              description:
                'Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user\'s choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user\'s session, such as the content of a shopping cart.',
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'More information',
              description: `For any queries in relation to the policy on cookies and your choices, please <a href="https://topbiketoursportugal.com/privacy-policy/">contact us</a>.`
            }
          ]
        }
      },
      pt: {
        // Consulte: https://support.google.com/tagmanager/answer/10718549?hl=pt
        consentModal: {
          title: 'Utilizamos cookies',
          description:
            'Este website utiliza cookies essenciais para garantir o seu correto funcionamento e cookies de rastreamento para compreender como interage com o mesmo. Estes últimos só serão definidos após consentimento.',
          acceptAllBtn: 'Aceitar todas',
          showPreferencesBtn: 'Gerir preferências individuais'
        },
        preferencesModal: {
          title: 'Gerir preferências de cookies',
          acceptAllBtn: 'Aceitar todas',
          savePreferencesBtn: 'Aceitar seleção atual',
          closeIconLabel: 'Fechar modal',
          sections: [
            {
              title: 'Utilização de cookies',
              description:
                'Utilizamos cookies para garantir as funcionalidades básicas do website e melhorar a sua experiência online.'
            },
            {
              title: 'Cookies estritamente necessários',
              description:
                'Estes cookies são essenciais para o funcionamento adequado do website, por exemplo para autenticação de utilizadores.',
              linkedCategory: CAT_NECESSARY
            },
            {
              title: 'Analítica',
              description:
                'Cookies utilizados para análise ajudam a recolher dados que permitem aos serviços compreender como os utilizadores interagem com um determinado serviço. Estes insights permitem aos serviços melhorar conteúdos e desenvolver funcionalidades que otimizam a experiência do utilizador.',
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Nome',
                  domain: 'Serviço',
                  description: 'Descrição',
                  expiration: 'Validade'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie definido pelo <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Expira após 12 dias'
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      'Cookie definido pelo <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Sessão'
                  }
                ]
              }
            },
            {
              title: 'Cookies Publicidade',
              description:
                'O Google utiliza cookies para publicidade, incluindo veiculação e renderização de anúncios, personalização de anúncios (consoante as suas definições de anúncio em <a href="https://g.co/adsettings">g.co/adsettings</a>), limitação do número de vezes que um anúncio é exibido, ocultação de anúncios que escolheu parar de ver e medição da eficácia de anúncios.',
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Publicidade',
              description:
                'O Google utiliza cookies para publicidade, incluindo veiculação e renderização de anúncios, personalização de anúncios (consoante as suas definições de anúncio em <a href="https://g.co/adsettings">g.co/adsettings</a>), limitação do número de vezes que um anúncio é exibido, ocultação de anúncios que escolheu parar de ver e medição da eficácia de anúncios.',
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Funcionalidade',
              description:
                'Cookies utilizados para funcionalidade permitem que os utilizadores interajam com um serviço ou site para aceder a características fundamentais. Consideram-se fundamentais preferências como idioma do utilizador, otimizações de produto que ajudam a manter e melhorar serviços, e manutenção de informação relativa à sessão do utilizador, como conteúdo de um carrinho de compras.',
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'Mais informações',
              description:
                'Para quaisquer questões relativas à política de cookies e às suas escolhas, por favor <a href="https://topbiketoursportugal.com/privacy-policy/">contacte-nos</a>.'
            }
          ]
        }
      }
    }
  },
  disablePageInteraction: false
};
