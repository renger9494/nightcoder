export enum OpenLinkType {
  Blank = '_blank'
}

export enum LinkType {
  None = 'none',
  URL = 'URL',
  Block = 'Block',
  Page = 'Page',
  Email = 'Email',
  Phone = 'Phone',
  Download = 'Download'
}

export interface PayloadLink {
  type: LinkType;
  value?: string;
  url?: string;
  openType: OpenLinkType;
}

/**
 * Format local url for published web site, because if a user change domain settings then page base url should change for all pages.
 * Anyway, we must keep this function clearly without difficult calculations that may affect to render a page
 * @param state state from airtap-publish-ruler
 * @param link {PayloadLink}
 * @returns string
 */
export function formatLocalUrl(state: any, link: PayloadLink) {
  const { url, type } = link;
  if (!url) return null;

  if (type != LinkType.Page) return url;

  const baseURL: string = state.page.info.baseURL;

  return `${baseURL}${url}`;
}
