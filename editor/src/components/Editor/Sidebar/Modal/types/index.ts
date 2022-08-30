import { CommunityProjectDto, BaseProjectPageDto, PagedProjectDto, ProjectSettingsDto } from '@/utils/api';
import { LinkType, PayloadLink } from '@/constants/link';
import { IBlocksData } from '@/components/Editor/Sidebar/Modal/components/AddNewBlockOrElementPopup/types';
import ObjectKeys from '@/utils/types/ObjectKeys';

export enum PopupType {
  SaveTemplate = 'SaveTemplate',
  NewTemplate = 'NewTemplate',
  AddBlock = 'AddBlock',
  FigmaToBlock = 'FigmaToBlock',
  Publish = 'Publish',
  PublishInCommunity = 'PublishInCommunity',
  Link = 'Link',
  Context = 'Context',
  AddElement = 'AddElement',
  Font = 'Font',
  ColorPicker = 'ColorPicker',
  InsertBlock = 'InsertBlock',
  TextSettings = 'TextSettings',
  Shape = 'Shape',
  BlockCollection = 'BlockCollection',
  Embed = 'Embed'
}

export enum PopupContainerType {
  Large = 'large',
  LargePaddings = 'large-paddings',
  SmallContext = 'small-context',
  Small = 'small',
  Medium = 'medium',
  Flex = 'flex'
}

export interface BasePopupData {
  isUnderHeader?: boolean;
  isNextToSidebar?: boolean;
  isOnLeftSide?: boolean;
}

export interface PopupSettings<T extends BasePopupData> {
  active: boolean;
  closeButton: boolean;
  header: string;
  description?: string;
  content: PopupType;
  location?: DOMRect;
  container?: PopupContainerType;
  background?: string;
  data: T;
}

export interface PublishPopupData extends BasePopupData {
  project: PagedProjectDto;
  page: BaseProjectPageDto;
  pages: BaseProjectPageDto[];
}

export interface PublishInCommunityPopupData extends BasePopupData {
  project: CommunityProjectDto;
  pages: BaseProjectPageDto[];
  projectSettings: ProjectSettingsDto;
  projectId: number;
}

export interface BlockConfig {
  dbId?: number;
  name: string;
}

export interface AddBlockPopupData extends BasePopupData {
  googleFonts: any[];
  blockConfig: BlockConfig;
}

export interface LinkPopupData extends BasePopupData {
  pages: BaseProjectPageDto[];
  blocks: any[];
  activeId: string;
  setActive: (element: BaseProjectPageDto | { id: string }) => void;
  changeLinkParams: (path: keyof PayloadLink, data: any) => void;
  setLinkType: (data: string) => void;
  setLinkValue: (data: string) => void;
  linkType: LinkType;
  openType: string;
  inputValue: any;
}

export interface ShapePopupData extends BasePopupData {
  shapeList: Array<ObjectKeys<string>>;
}

export interface BlockPopupData extends BasePopupData {
  blockCategories: Array<IBlocksData>;
}

export interface EmbedPopupData extends BasePopupData {
  setEmbedType: Function;
}

export interface TemplateElementConfig {
  templateId: number;
  config: string;
}

export interface TemplateElement {
  interfaceElementId: number;
  templateId: number;
}

export interface SaveTemplatePopupData extends BasePopupData {
  /**
   * cloned template element
   */
  template: TemplateElement;
}

export interface NewTemplatePopupData extends BasePopupData {
  projectId: number;
  pageId: number;
}

export interface ContextPopupData extends BasePopupData {
  list: any[];
  elementId: string;
  isOnLeftSide: boolean;
  moveElemUp: () => void;
  moveElemDown: () => void;
  renameItem: () => void;
  toggleHideElement: () => void;
}

export interface AddElementPopupData extends BasePopupData {
  list: any[];
}

interface FontSettings {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  googleFontFamily?: string;
}

export interface FontPopupData extends BasePopupData {
  isSearchFieldActive: boolean;
  element: any;
  selectFontHandler: (settings: FontSettings) => void;
  activeFontFamily: ObjectKeys<any>;
}

export interface ColorPickerPopupData extends BasePopupData {
  hex: string;
  opacity: string;
  styleProperty: string;
  isOnlyColor: boolean;
  activeTab: string;
  gradient: any;
  colorPickHandler: (colorObject: any) => void;
}

export interface InsertBlockPopupData extends BasePopupData {
  insertAfter: number;
}

/** TODO: move all from mapState in Popup to here */



export interface TextSettingsPopupData extends BasePopupData {
  elementId: string;
  changeStyleHandler: (param: any) => void;
  changeTypeHandler: (param: { type: any }) => void;
  isButton: boolean;
}
