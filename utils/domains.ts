import SocialData from '../data/social.json';

export function getSocialDomains(): string[] {
    return Object.values(SocialData)
        .map((item) => {
            try {
                if (item.href) {
                    return new URL(item.href).hostname;
                }
            } finally {
                return '';
            }
        })
        .filter((domain) => domain !== '');
}

export function getInternalDomains(includeSocialDomains: boolean = true): string[] {
    return ['topbiketoursportugal.com', 'topwalkingtoursportugal.com', ...(includeSocialDomains ? getSocialDomains() : [])];
}

export function isInternalDomain(url: string): boolean {
    try {
        const hostname = new URL(url).hostname;
        return getInternalDomains(false).some((domain) => hostname.includes(domain));
    } catch {
        return false;
    }
}
