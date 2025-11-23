(function () {
    if (window.basic_script) {
        return;
    }

    window.basic_script = true;

    function attachEvent(selector, event, fn) {
        const matches =
            typeof selector === 'string'
                ? document.querySelectorAll(selector)
                : selector;
        if (matches && matches.length) {
            matches.forEach((elem) => {
                elem.addEventListener(event, (e) => fn(e, elem), false);
            });
        }
    }

    const onLoad = function () {
        let lastKnownScrollPosition = window.scrollY;
        let ticking = true;

        attachEvent('#header nav', 'click', function () {
            document
                .querySelector('[data-aw-toggle-menu]')
                ?.classList.remove('expanded');
            document.body.classList.remove('overflow-hidden');
            document.getElementById('header')?.classList.remove('h-screen');
            document.getElementById('header')?.classList.remove('expanded');
            document.getElementById('header')?.classList.remove('bg-page');
            document.querySelector('#header nav')?.classList.add('hidden');
            document
                .querySelector('#header > div > div:last-child')
                ?.classList.add('hidden');
        });

        attachEvent('[data-aw-toggle-menu]', 'click', function (_, elem) {
            elem.classList.toggle('expanded');
            document.body.classList.toggle('overflow-hidden');
            document.getElementById('header')?.classList.toggle('h-screen');
            document.getElementById('header')?.classList.toggle('expanded');
            document.getElementById('header')?.classList.toggle('bg-page');
            document.querySelector('#header nav')?.classList.toggle('hidden');
            document
                .querySelector('#header > div > div:last-child')
                ?.classList.toggle('hidden');
        });

        attachEvent('[data-theme-toggle]', 'click', function (_, elem) {
            const theme = elem.getAttribute('data-theme-toggle');
            if (theme === 'system') {
                localStorage.removeItem('darkMode');
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else {
                localStorage.setItem('darkMode', theme);
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            // Update UI state if needed (e.g., active class on buttons)
            // Since we use CSS classes based on .dark or data attributes, this might be automatic
            // or handled by the CSS in ToggleTheme.astro
        });

        // Listen for system preference changes
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (event) => {
                if (!localStorage.getItem('darkMode')) {
                    if (event.matches) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            });

        attachEvent('[data-aw-social-share]', 'click', function (_, elem) {
            const network = elem.getAttribute('data-aw-social-share');
            const url = encodeURIComponent(elem.getAttribute('data-aw-url'));
            const text = encodeURIComponent(elem.getAttribute('data-aw-text'));

            let href;
            switch (network) {
                case 'facebook':
                    href = `https://www.facebook.com/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'linkedin':
                    href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
                    break;
                case 'whatsapp':
                    href = `https://wa.me/?text=${text}%20${url}`;
                    break;
                case 'mail':
                    href = `mailto:?subject=%22${text}%22&body=${text}%20${url}`;
                    break;

                default:
                    return;
            }

            const newlink = document.createElement('a');
            newlink.target = '_blank';
            newlink.href = href;
            newlink.click();
        });

        const screenSize = window.matchMedia('(max-width: 767px)');
        screenSize.addEventListener('change', function () {
            document
                .querySelector('[data-aw-toggle-menu]')
                ?.classList.remove('expanded');
            document.body.classList.remove('overflow-hidden');
            document.getElementById('header')?.classList.remove('h-screen');
            document.getElementById('header')?.classList.remove('expanded');
            document.getElementById('header')?.classList.remove('bg-page');
            document.querySelector('#header nav')?.classList.add('hidden');
            document
                .querySelector('#header > div > div:last-child')
                ?.classList.add('hidden');
        });

        function applyHeaderStylesOnScroll() {
            const header = document.querySelector('#header[data-aw-sticky-header]');
            if (!header) return;
            if (
                lastKnownScrollPosition > 60 &&
                !header.classList.contains('scroll')
            ) {
                header.classList.add('scroll');
            } else if (
                lastKnownScrollPosition <= 60 &&
                header.classList.contains('scroll')
            ) {
                header.classList.remove('scroll');
            }
            ticking = false;
        }
        applyHeaderStylesOnScroll();

        attachEvent([document], 'scroll', function () {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    applyHeaderStylesOnScroll();
                });
                ticking = true;
            }
        });
    };
    const onPageShow = function () {
        document.documentElement.classList.add('motion-safe:scroll-smooth');
        const elem = document.querySelector('[data-aw-toggle-menu]');
        if (elem) {
            elem.classList.remove('expanded');
        }
        document.body.classList.remove('overflow-hidden');
        document.getElementById('header')?.classList.remove('h-screen');
        document.getElementById('header')?.classList.remove('expanded');
        document.querySelector('#header nav')?.classList.add('hidden');
    };

    // Re-apply theme from localStorage after page swap
    const reapplyTheme = function () {
        const getTheme = () => {
            if (
                typeof localStorage !== 'undefined' &&
                localStorage.getItem('darkMode')
            ) {
                return localStorage.getItem('darkMode');
            }
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        };

        const theme = getTheme();
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Execute immediately if page is already loaded, otherwise wait for load event
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', onLoad);
        window.addEventListener('pageshow', onPageShow);
    } else {
        // Page is already loaded
        onLoad();
        onPageShow();
    }

    document.addEventListener('astro:after-swap', () => {
        reapplyTheme();
        onLoad();
        onPageShow();
    });

    // Also handle astro:page-load to ensure theme persists
    document.addEventListener('astro:page-load', () => {
        reapplyTheme();
    });
})();
