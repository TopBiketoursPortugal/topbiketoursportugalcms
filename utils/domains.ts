import SocialData from '../data/social.json';

export function getSocialDomains(): string[] {
    return Object.values(SocialData)
        .map((item) => {
            try {
                if (item.href) {
                    return new URL(item.href).hostname;
                }
                return '';
            } catch {
                return '';
            }
        })
        .filter((domain) => domain !== '');
}

export function getInternalDomains(): string[] {
    return ['topbiketoursportugal.com', ...getSocialDomains()];
}

export function isInternalDomain(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return getInternalDomains().some((domain) => hostname.includes(domain));
    } catch {
        return false;
    }
}
