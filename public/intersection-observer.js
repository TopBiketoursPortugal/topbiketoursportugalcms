/* Inspired by: https://github.com/heidkaemper/tailwindcss-intersect */
const Observer = {
    observer: null,
    delayBetweenAnimations: 100,
    animationCounter: 0,

    start() {
        const selectors = [
            '[class*=" intersect:"]',
            '[class*=":intersect:"]',
            '[class^="intersect:"]',
            '[class="intersect"]',
            '[class*=" intersect "]',
            '[class^="intersect "]',
            '[class$=" intersect"]'
        ];

        const elements = Array.from(
            document.querySelectorAll(selectors.join(','))
        );

        const getThreshold = (element) => {
            if (element.classList.contains('intersect-full')) return 0.99;
            if (element.classList.contains('intersect-half')) return 0.5;
            if (element.classList.contains('intersect-quarter')) return 0.25;
            if (element.classList.contains('intersect-eighth')) return 0.125;
            return 0;
        };

        elements.forEach((el) => {
            el.setAttribute('no-intersect', '');
            el._intersectionThreshold = getThreshold(el);
        });

        const callback = (entries) => {
            entries.forEach((entry) => {
                requestAnimationFrame(() => {
                    const target = entry.target;
                    const intersectionRatio = entry.intersectionRatio;
                    const threshold = target._intersectionThreshold;

                    if (target.classList.contains('intersect-no-queue')) {
                        if (entry.isIntersecting) {
                            target.removeAttribute('no-intersect');
                            if (target.classList.contains('intersect-once')) {
                                this.observer.unobserve(target);
                            }
                        } else {
                            target.setAttribute('no-intersect', '');
                        }
                        return;
                    }

                    if (entry.isIntersecting && intersectionRatio >= threshold) {
                        if (!target.hasAttribute('data-animated')) {
                            target.removeAttribute('no-intersect');
                            target.setAttribute('data-animated', 'true');
                            if (target.classList.contains('intersect-once')) {
                                this.observer.unobserve(target);
                            }
                        }
                    } else {
                        target.setAttribute('no-intersect', '');
                        target.removeAttribute('data-animated');
                    }
                });
            });
        };

        this.observer = new IntersectionObserver(callback.bind(this), {
            threshold: [0, 0.25, 0.5, 0.99]
        });

        elements.forEach((el) => {
            this.observer.observe(el);
        });
    }
};

Observer.start();

document.addEventListener('astro:after-swap', () => {
    Observer.start();
});
