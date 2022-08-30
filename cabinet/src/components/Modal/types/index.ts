import { CommunityProjectDto, PagedProjectDto, BaseProjectPageDto, ProjectSettingsDto } from '@/utils/api';
import ObjectKeys from '@/utils/types/ObjectKeys';

export enum PopupType {
  SaveTemplate = 'SaveTemplate',
  NewTemplate = 'NewTemplate',
  AddBlock = 'AddBlock',
  Publish = 'Publish',
  PublishInCommunity = 'PublishInCommunity',
  OldPublish = 'OldPublish',
  PublishCommunity = 'PublishCommunity',
  Link = 'Link',
  Context = 'Context',
  AddElement = 'AddElement',
  Font = 'Font',
  ColorPicker = 'ColorPicker',
  InsertBlock = 'InsertBlock',
  TemplateHistory = 'TemplateHistory',
  TextSettings = 'TextSettings',
  Shape = 'Shape',
  BlockCollection = 'BlockCollection',
  Embed = 'Embed',
  ChangedAccountSettings = 'ChangedAccountSettings',
  LimitProject = 'LimitProject'
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
  background?: string;
  content: PopupType;
  location?: DOMRect;
  container?: PopupContainerType;
  data: T;
}

export interface PublishPopupData extends BasePopupData {
  project: PagedProjectDto;
  page?: BaseProjectPageDto;
  pages: BaseProjectPageDto[];
  isPage: boolean;
}

export interface PublishInCommunityPopupData extends BasePopupData {
  project: CommunityProjectDto;
  pages: BaseProjectPageDto[];
  projectSettings: ProjectSettingsDto;
  projectId: number;
}

export interface ShapePopupData extends BasePopupData {
  shapeList: Array<ObjectKeys<string>>;
}


export interface EmbedPopupData extends BasePopupData {
  setEmbedType: Function;
}

export interface ChangeAccountSettingsPopupData extends BasePopupData {
  sendMail: Function;
  isPassword: boolean;
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


export interface InsertBlockPopupData extends BasePopupData {
  insertAfter: number;
}
