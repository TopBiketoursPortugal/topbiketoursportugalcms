import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import { GOOGLE_TAG_MANAGER_ID } from 'astro:env/client';
import SiteData from 'src/../data/site.json';

const SITE_ORIGIN = new URL(SiteData.en.site.url).origin;
const PRIVACY_POLICY_URL = `${SITE_ORIGIN}/privacy-policy/`;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Record<string, any>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    _gtmLoaded?: boolean;
    _wcLoaded?: boolean;
  }
}

function loadGTM() {
  // Only load GTM once
  if (window._gtmLoaded) return;
  window._gtmLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    'event': 'gtm.js'
  });

  const script = document.createElement('script');
  script.async = true;
  script.src =
    'https://www.googletagmanager.com/gtm.js?id=' + GOOGLE_TAG_MANAGER_ID;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

// WhatConverts lead-source tracker. Sets attribution cookies, so unlike GTM
// (advanced consent mode, cookieless until granted) it only loads AFTER
// analytics consent.
function loadWhatConverts() {
  if (window._wcLoaded) return;
  window._wcLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = '//s.ksrndkehqnwntyxlhgto.com/137152.js';
  document.head.appendChild(script);
}

function updateGtagConsent(cookie: CookieConsent.CookieValue) {
  const hasAnalytics = cookie.categories?.includes(CAT_ANALYTICS);
  const hasMarketing = cookie.categories?.includes(CAT_MARKETING);
  const hasFunctionality = cookie.categories?.includes(CAT_FUNCTIONALITY);

  window.gtag?.('set', 'ads_data_redaction', !hasMarketing);
  window.gtag?.('consent', 'update', {
    [SERVICE_AD_STORAGE]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_AD_USER_DATA]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_AD_PERSONALIZATION]: hasMarketing ? 'granted' : 'denied',
    [SERVICE_ANALYTICS_STORAGE]: hasAnalytics ? 'granted' : 'denied',
    [SERVICE_FUNCTIONALITY_STORAGE]: hasFunctionality ? 'granted' : 'denied',
    [SERVICE_PERSONALIZATION_STORAGE]: hasFunctionality ? 'granted' : 'denied',
    [SERVICE_SECURITY_STORAGE]: 'granted'
  });

  // Advanced consent mode: GTM is normally loaded by the inline script in
  // CookieConsent.astro regardless of consent; this is only a fallback
  // (both paths are guarded by window._gtmLoaded).
  loadGTM();

  if (hasAnalytics) {
    loadWhatConverts();
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
                "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
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
                    expiration: 'Expires after 2 years'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a href="https://business.safety.google/adscookies/">Google Analytics</a> to persist session state',
                    expiration: 'Expires after 2 years'
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
                "Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'More information',
              description: `For any queries in relation to the policy on cookies and your choices, please <a href="${PRIVACY_POLICY_URL}">contact us</a>.`
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
                    expiration: 'Expira após 2 anos'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie definido pelo <a href="https://business.safety.google/adscookies/">Google Analytics</a> para manter o estado da sessão',
                    expiration: 'Expira após 2 anos'
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
              description: `Para quaisquer questões relativas à política de cookies e às suas escolhas, por favor <a href="${PRIVACY_POLICY_URL}">contacte-nos</a>.`
            }
          ]
        }
      },
      de: {
        consentModal: {
          title: 'Wir verwenden Cookies',
          description:
            'Diese Website verwendet notwendige Cookies für ihren einwandfreien Betrieb sowie Tracking-Cookies, um zu verstehen, wie Sie mit ihr interagieren. Letztere werden erst nach Ihrer Einwilligung gesetzt.',
          acceptAllBtn: 'Alle akzeptieren',
          showPreferencesBtn: 'Einstellungen individuell verwalten'
        },
        preferencesModal: {
          title: 'Cookie-Einstellungen verwalten',
          acceptAllBtn: 'Alle akzeptieren',
          savePreferencesBtn: 'Aktuelle Auswahl akzeptieren',
          closeIconLabel: 'Fenster schließen',
          sections: [
            {
              title: 'Verwendung von Cookies',
              description:
                'Wir verwenden Cookies, um die grundlegenden Funktionen der Website sicherzustellen und Ihr Online-Erlebnis zu verbessern.'
            },
            {
              title: 'Unbedingt erforderliche Cookies',
              description:
                'Diese Cookies sind für das einwandfreie Funktionieren der Website unerlässlich, zum Beispiel für die Authentifizierung von Nutzern.',
              linkedCategory: CAT_NECESSARY
            },
            {
              title: 'Analyse',
              description:
                'Analyse-Cookies helfen dabei, Daten zu erfassen, anhand derer Dienste nachvollziehen können, wie Nutzer mit einem bestimmten Angebot interagieren. Diese Erkenntnisse ermöglichen es, Inhalte zu verbessern und bessere Funktionen zu entwickeln, die das Nutzererlebnis optimieren.',
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Dienst',
                  description: 'Beschreibung',
                  expiration: 'Ablauf'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie, gesetzt von <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Läuft nach 2 Jahren ab'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie, gesetzt von <a href="https://business.safety.google/adscookies/">Google Analytics</a>, um den Sitzungsstatus zu speichern',
                    expiration: 'Läuft nach 2 Jahren ab'
                  }
                ]
              }
            },
            {
              title: 'Werbe-Cookies',
              description:
                'Google verwendet Cookies für Werbezwecke, unter anderem für die Auslieferung und Darstellung von Anzeigen, für personalisierte Werbung (abhängig von Ihren Anzeigeneinstellungen unter <a href="https://g.co/adsettings">g.co/adsettings</a>), für die Begrenzung der Häufigkeit, mit der eine Anzeige einem Nutzer gezeigt wird, für das Ausblenden von Anzeigen, die Sie nicht mehr sehen möchten, sowie für die Messung der Werbewirksamkeit.',
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Werbung',
              description:
                'Google verwendet Cookies für Werbezwecke, unter anderem für die Auslieferung und Darstellung von Anzeigen, für personalisierte Werbung (abhängig von Ihren Anzeigeneinstellungen unter <a href="https://g.co/adsettings">g.co/adsettings</a>), für die Begrenzung der Häufigkeit, mit der eine Anzeige einem Nutzer gezeigt wird, für das Ausblenden von Anzeigen, die Sie nicht mehr sehen möchten, sowie für die Messung der Werbewirksamkeit.',
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Funktionalität',
              description:
                'Funktionale Cookies ermöglichen es Nutzern, mit einem Dienst oder einer Website zu interagieren und auf Funktionen zuzugreifen, die für diesen Dienst grundlegend sind. Dazu gehören zum Beispiel Präferenzen wie die vom Nutzer gewählte Sprache, Produktoptimierungen zur Aufrechterhaltung und Verbesserung eines Dienstes sowie das Speichern von Informationen zur Sitzung eines Nutzers, etwa der Inhalt eines Warenkorbs.',
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'Weitere Informationen',
              description: `Bei Fragen zu unserer Cookie-Richtlinie und zu Ihren Wahlmöglichkeiten <a href="${PRIVACY_POLICY_URL}">kontaktieren Sie uns bitte</a>.`
            }
          ]
        }
      },
      es: {
        consentModal: {
          title: 'Utilizamos cookies',
          description:
            'Este sitio web utiliza cookies esenciales para garantizar su correcto funcionamiento y cookies de seguimiento para entender cómo interactúas con él. Estas últimas solo se instalarán previo consentimiento.',
          acceptAllBtn: 'Aceptar todas',
          showPreferencesBtn: 'Gestionar preferencias individuales'
        },
        preferencesModal: {
          title: 'Gestionar preferencias de cookies',
          acceptAllBtn: 'Aceptar todas',
          savePreferencesBtn: 'Aceptar la selección actual',
          closeIconLabel: 'Cerrar ventana',
          sections: [
            {
              title: 'Uso de cookies',
              description:
                'Utilizamos cookies para garantizar las funcionalidades básicas del sitio web y para mejorar tu experiencia en línea.'
            },
            {
              title: 'Cookies estrictamente necesarias',
              description:
                'Estas cookies son esenciales para el correcto funcionamiento del sitio web, por ejemplo, para la autenticación de usuarios.',
              linkedCategory: CAT_NECESSARY
            },
            {
              title: 'Analítica',
              description:
                'Las cookies de analítica ayudan a recopilar datos que permiten a los servicios entender cómo interactúan los usuarios con un servicio determinado. Esta información permite mejorar los contenidos y desarrollar mejores funcionalidades que optimizan la experiencia del usuario.',
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Nombre',
                  domain: 'Servicio',
                  description: 'Descripción',
                  expiration: 'Caducidad'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie instalada por <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Caduca a los 2 años'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie instalada por <a href="https://business.safety.google/adscookies/">Google Analytics</a> para mantener el estado de la sesión',
                    expiration: 'Caduca a los 2 años'
                  }
                ]
              }
            },
            {
              title: 'Cookies publicitarias',
              description:
                'Google utiliza cookies con fines publicitarios: para mostrar y renderizar anuncios, personalizarlos (en función de tu configuración de anuncios en <a href="https://g.co/adsettings">g.co/adsettings</a>), limitar el número de veces que se muestra un anuncio a un usuario, silenciar los anuncios que has decidido dejar de ver y medir la eficacia de los anuncios.',
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Publicidad',
              description:
                'Google utiliza cookies con fines publicitarios: para mostrar y renderizar anuncios, personalizarlos (en función de tu configuración de anuncios en <a href="https://g.co/adsettings">g.co/adsettings</a>), limitar el número de veces que se muestra un anuncio a un usuario, silenciar los anuncios que has decidido dejar de ver y medir la eficacia de los anuncios.',
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Funcionalidad',
              description:
                'Las cookies de funcionalidad permiten a los usuarios interactuar con un servicio o un sitio para acceder a funciones fundamentales de ese servicio. Entre ellas se incluyen preferencias como el idioma elegido por el usuario, optimizaciones del producto que ayudan a mantener y mejorar el servicio, y el mantenimiento de información relativa a la sesión del usuario, como el contenido de un carrito de la compra.',
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'Más información',
              description: `Si tienes cualquier duda sobre nuestra política de cookies y tus opciones, <a href="${PRIVACY_POLICY_URL}">ponte en contacto con nosotros</a>.`
            }
          ]
        }
      },
      fr: {
        consentModal: {
          title: 'Nous utilisons des cookies',
          description:
            "Ce site utilise des cookies essentiels pour assurer son bon fonctionnement, ainsi que des cookies de mesure d'audience pour comprendre comment vous interagissez avec lui. Ces derniers ne sont déposés qu'après votre consentement.",
          acceptAllBtn: 'Tout accepter',
          showPreferencesBtn: 'Gérer mes préférences'
        },
        preferencesModal: {
          title: 'Gérer les préférences de cookies',
          acceptAllBtn: 'Tout accepter',
          savePreferencesBtn: 'Accepter la sélection actuelle',
          closeIconLabel: 'Fermer la fenêtre',
          sections: [
            {
              title: 'Utilisation des cookies',
              description:
                'Nous utilisons des cookies pour assurer les fonctionnalités de base du site et pour améliorer votre expérience en ligne.'
            },
            {
              title: 'Cookies strictement nécessaires',
              description:
                "Ces cookies sont indispensables au bon fonctionnement du site, par exemple pour l'authentification des utilisateurs.",
              linkedCategory: CAT_NECESSARY
            },
            {
              title: "Mesure d'audience",
              description:
                "Les cookies de mesure d'audience permettent de recueillir des données afin de comprendre comment les utilisateurs interagissent avec un service. Ces informations aident à améliorer les contenus et à développer de meilleures fonctionnalités au bénéfice de l'utilisateur.",
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Nom',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie déposé par <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Expire au bout de 2 ans'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie déposé par <a href="https://business.safety.google/adscookies/">Google Analytics</a> pour conserver l\'état de la session',
                    expiration: 'Expire au bout de 2 ans'
                  }
                ]
              }
            },
            {
              title: 'Cookies publicitaires',
              description:
                "Google utilise des cookies à des fins publicitaires : diffusion et affichage des annonces, personnalisation des annonces (selon vos paramètres sur <a href=\"https://g.co/adsettings\">g.co/adsettings</a>), limitation du nombre d'affichages d'une annonce, masquage des annonces que vous avez choisi de ne plus voir et mesure de l'efficacité des annonces.",
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Publicité',
              description:
                "Google utilise des cookies à des fins publicitaires : diffusion et affichage des annonces, personnalisation des annonces (selon vos paramètres sur <a href=\"https://g.co/adsettings\">g.co/adsettings</a>), limitation du nombre d'affichages d'une annonce, masquage des annonces que vous avez choisi de ne plus voir et mesure de l'efficacité des annonces.",
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Fonctionnalités',
              description:
                "Les cookies de fonctionnalité permettent aux utilisateurs d'interagir avec un service ou un site pour accéder à des fonctions essentielles à celui-ci. Cela comprend notamment les préférences telles que la langue choisie, les optimisations qui contribuent à maintenir et à améliorer le service, ainsi que la conservation des informations liées à la session, comme le contenu d'un panier d'achat.",
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: "Plus d'informations",
              description: `Pour toute question relative à notre politique en matière de cookies et à vos choix, veuillez <a href="${PRIVACY_POLICY_URL}">nous contacter</a>.`
            }
          ]
        }
      },
      nl: {
        consentModal: {
          title: 'Wij gebruiken cookies',
          description:
            'Deze website gebruikt essentiële cookies om goed te kunnen functioneren en trackingcookies om te begrijpen hoe u de site gebruikt. Die laatste worden pas geplaatst na uw toestemming.',
          acceptAllBtn: 'Alles accepteren',
          showPreferencesBtn: 'Voorkeuren beheren'
        },
        preferencesModal: {
          title: 'Cookievoorkeuren beheren',
          acceptAllBtn: 'Alles accepteren',
          savePreferencesBtn: 'Huidige selectie accepteren',
          closeIconLabel: 'Venster sluiten',
          sections: [
            {
              title: 'Gebruik van cookies',
              description:
                'Wij gebruiken cookies om de basisfunctionaliteit van de website te waarborgen en om uw online ervaring te verbeteren.'
            },
            {
              title: 'Strikt noodzakelijke cookies',
              description:
                'Deze cookies zijn essentieel voor het correct functioneren van de website, bijvoorbeeld voor het inloggen van gebruikers.',
              linkedCategory: CAT_NECESSARY
            },
            {
              title: 'Analyse',
              description:
                'Cookies voor analysedoeleinden helpen gegevens te verzamelen waarmee diensten kunnen begrijpen hoe gebruikers met een bepaalde dienst omgaan. Met deze inzichten kunnen diensten zowel hun inhoud verbeteren als betere functies ontwikkelen die de gebruikerservaring ten goede komen.',
              linkedCategory: CAT_ANALYTICS,
              cookieTable: {
                headers: {
                  name: 'Naam',
                  domain: 'Dienst',
                  description: 'Beschrijving',
                  expiration: 'Vervaltermijn'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie geplaatst door <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
                    expiration: 'Vervalt na 2 jaar'
                  },
                  {
                    name: '_ga_*',
                    domain: 'Google Analytics',
                    description:
                      'Cookie geplaatst door <a href="https://business.safety.google/adscookies/">Google Analytics</a> om de sessiestatus te bewaren',
                    expiration: 'Vervalt na 2 jaar'
                  }
                ]
              }
            },
            {
              title: 'Advertentiecookies',
              description:
                'Google gebruikt cookies voor advertenties, waaronder het aanbieden en weergeven van advertenties, het personaliseren van advertenties (afhankelijk van uw advertentie-instellingen op <a href="https://g.co/adsettings">g.co/adsettings</a>), het beperken van het aantal keren dat een advertentie aan een gebruiker wordt getoond, het verbergen van advertenties die u niet meer wilt zien en het meten van de effectiviteit van advertenties.',
              linkedCategory: CAT_MARKETING
            },
            {
              title: 'Adverteren',
              description:
                'Google gebruikt cookies voor advertenties, waaronder het aanbieden en weergeven van advertenties, het personaliseren van advertenties (afhankelijk van uw advertentie-instellingen op <a href="https://g.co/adsettings">g.co/adsettings</a>), het beperken van het aantal keren dat een advertentie aan een gebruiker wordt getoond, het verbergen van advertenties die u niet meer wilt zien en het meten van de effectiviteit van advertenties.',
              linkedCategory: CAT_ADVERTISEMENT
            },
            {
              title: 'Functionaliteit',
              description:
                'Cookies voor functionaliteit stellen gebruikers in staat om met een dienst of site te werken en toegang te krijgen tot functies die essentieel zijn voor die dienst. Daaronder vallen voorkeuren zoals de taalkeuze van de gebruiker, productoptimalisaties die helpen een dienst te onderhouden en te verbeteren, en het bewaren van informatie over de sessie van een gebruiker, zoals de inhoud van een winkelwagen.',
              linkedCategory: CAT_FUNCTIONALITY
            },
            {
              title: 'Meer informatie',
              description: `Heeft u vragen over ons cookiebeleid en uw keuzes? <a href="${PRIVACY_POLICY_URL}">Neem gerust contact met ons op</a>.`
            }
          ]
        }
      }
    }
  },
  disablePageInteraction: false
};
