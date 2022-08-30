import { UserFavoriteType } from './api';
import apiClient from './apiClient';
import { IBlock } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';

export interface IFontVariant {
  name: string;
  style: string;
}

export interface IFont {
  family: string;
  category: string;
  variants: IFontVariant[];
}

interface IFavorite {
  type: UserFavoriteType;
  getUniqueId(data: IFavoriteData): string;
}

interface IFavoriteData {}

export interface IFontFavoriteData extends IFavoriteData {
  font: IFont;
}

export interface IBlockFavoriteData extends IFavoriteData {
  block: IBlock;
}

export class FontFavorite implements IFavorite {
  type: UserFavoriteType = UserFavoriteType.Font;
  getUniqueId(data: IFontFavoriteData): string {
    const { font } = data;
    const fontType = font.variants[0];
    return [font.family, font.category, fontType.name, fontType.style].filter(x => !!x).join('-');
  }
}

export class BlockFavorite implements IFavorite {
  type: UserFavoriteType = UserFavoriteType.Block;
  getUniqueId(data: IBlockFavoriteData): string {
    const { block } = data;
    return `${block.id}`;
  }
}

export class UserFavoriteStub<IFavoriteData> {
  /**
   * type string[] because vue support ref Set<string> only in 3 version,
   * https://github.com/vuejs/vue/issues/2410#issuecomment-761108365
   */
  public favorites: string[] = [];

  constructor(private favorite: IFavorite) {}

  async init() {
    const { data } = await apiClient.interfaceElements.interfaceElementsGetUserFavorites(this.favorite.type);
    for (const id of data) {
      this.favorites.push(id);
    }
  }

  has(data: IFavoriteData) {
    const uniqueId = this.favorite.getUniqueId(data);

    return this.favorites.includes(uniqueId);
  }

  async addOrDelete(data: IFavoriteData) {
    const uniqueId = this.favorite.getUniqueId(data);
    const index = this.favorites.indexOf(uniqueId);
    const hasFontFavorite = index != -1;
    if (hasFontFavorite) {
      await apiClient.interfaceElements.interfaceElementsDeleteUserFavorite(this.favorite.type, uniqueId);

      this.favorites.splice(index, 1);
    } else {
      await apiClient.interfaceElements.interfaceElementsAddUserFavorite(this.favorite.type, uniqueId);

      this.favorites.push(uniqueId);
    }
  }
}
