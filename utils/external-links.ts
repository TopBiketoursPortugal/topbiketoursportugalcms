import { getInternalDomains } from './domains';

export const externalLinksConfig = {
  externalTarget: '_blank',
  externalRel: 'nofollow noopener noreferrer',
  internalTarget: '',
  internalRel: '',
  internalDomains: getInternalDomains()
};
