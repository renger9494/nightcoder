import ObjectKeys from '@/utils/types/ObjectKeys';
import { LinkType } from '../constants/link';

export function formatLink(link: string, linkType: LinkType) {
  const handlers: ObjectKeys<Function> = {
    [LinkType.URL](link: string) {
      if (link.includes('http://') || link.includes('https://')) return link;
      return `//${link}`;
    },
    [LinkType.Block]: (link: string) => `#${link}`,
    [LinkType.Email]: (link: string) => `mailto:${link}`,
    [LinkType.Phone]: (link: string) => `tel:${link}`,
    [LinkType.Page]: (link: string) => link,
    [LinkType.None]: (link: string) => ''
  };

  if (linkType == LinkType.Download) return handlers[LinkType.URL](link);

  const handler = handlers[linkType];

  if (handler) return handler(link);

  throw new Error('Unknown link type' + linkType);
}
