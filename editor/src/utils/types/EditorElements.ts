import ObjectKeys from '@/utils/types/ObjectKeys';
import { FileDto } from '@/utils/api';
import { EmbedType } from '@/constants/embed';
import { LinkType, OpenLinkType } from '@/constants/link';

export enum ElementsTypes {
  BUTTON = 'button',
  CIRCLE = 'circle',
  EMBED = 'embed',
  FORM = 'form',
  ICON = 'icon',
  IMAGE = 'image',
  RECTANGLE = 'rectangle',
  TEXT = 'text',
  VIDEO = 'video'
}

// TODO: add types for block

export interface ElementConfig {
  parentId: string;
  name: string;
  type: ElementsTypes;
  id: string;
  location: ObjectKeys<ElementConfigLocation>;
}

export interface DefaultPayload {
  zIndex: string | number;
  link: {
    type: LinkType;
    openType: OpenLinkType;
    value?: string;
    url?: string;
  };
}

export interface AxisAlign {
  left?: string | null;
  top?: string | null;
  right?: string | null;
  bottom?: string | null;
}

export interface ElementConfigLocation {
  y: number;
  x: number;
  xInPercent: number;
  w: number;
  wInPercent: number;
  h: number;
  a: number;
  textBoxStyle?: number | null;
  yaxisAlign?: ObjectKeys<AxisAlign> | null;
  xaxisAlign?: ObjectKeys<AxisAlign> | null;
}

//Text types
export interface TextConfigStyles {
  alignItems: string;
  letterSpacing: string;
  font: string;
  fontSize: string;
  color: string;
  border?: string | null;
  '-webkit-text-stroke'?: string | null;
  textShadow?: string | null;
  boxShadow?: string | null;
  textTransform?: string | null;
  textDecoration?: string | null;
  textAlign?: string;
}

export interface TextConfigPayload extends DefaultPayload {
  type: string;
  content: string;
  isContentChanged: boolean;
  font: ObjectKeys<string>;
}

export interface TextConfig extends ElementConfig {
  styles: ObjectKeys<TextConfigStyles>;
  payload: TextConfigPayload;
}

//Button types
export interface ButtonConfigStyles {
  textAlign: string;
  letterSpacing: string;
  font: string;
  color: string;
  borderRadius: string;
  background: string;
  display: string;
  justifyContent: string;
  alignItems: string;
  gridGap: string;
  width: string;
  border?: string | null;
  boxShadow?: string | null;
}

export enum ButtonIconPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface ButtonConfigPayload extends DefaultPayload {
  content: string;
  image: FileDto | { fullPath: string };
  isIconHidden: boolean;
  iconPosition: ButtonIconPosition;
}

export interface ButtonConfig extends ElementConfig {
  styles: ObjectKeys<ButtonConfigStyles>;
  payload: ButtonConfigPayload;
}

//Image type
export interface ImageConfigStyles {
  borderRadius: string;
  objectFit: string;
  opacity: number;
  overlay?: string | null;
  border?: string | null;
  boxShadow?: string | null;
}

export interface ImageConfigPayloadDefaultImage {
  fullPath: string;
  fullPathJp2: string;
  fullPathWebP: string;
}

export interface ImageConfigPayload extends DefaultPayload {
  image: FileDto | ImageConfigPayloadDefaultImage;
}

export interface ImageConfig extends ElementConfig {
  styles: ObjectKeys<ImageConfigStyles>;
  payload: ImageConfigPayload;
}

//Shape type
export interface ShapeConfigStyles {
  borderRadius: string;
  background: string;
  border?: string | null;
  boxShadow?: string | null;
}

export interface ShapeConfig extends ElementConfig {
  styles: ObjectKeys<ShapeConfigStyles>;
  payload: DefaultPayload;
}

//Icon type
export interface IconConfigStyles {
  borderRadius: string;
  objectFit: string;
  opacity: number;
  overlay?: string | null;
  border?: string | null;
  boxShadow?: string | null;
}

export interface IconConfigPayload extends DefaultPayload {
  src: string;
}

export interface IconConfig extends ElementConfig {
  styles: ObjectKeys<IconConfigStyles>;
  payload: IconConfigPayload;
}

//Embed type
export interface EmbedConfigStyles {
  borderRadius: string;
  objectFit: string;
  opacity: number;
  overlay?: string;
  border?: string;
  boxShadow?: string;
}

export interface EmbedConfigPayload extends DefaultPayload {
  code: string;
  type: EmbedType;
}

export interface EmbedConfig extends ElementConfig {
  styles: ObjectKeys<EmbedConfigStyles>;
  payload: EmbedConfigPayload;
}

//Form type
export enum FormElementType {
  BUTTON = 'button',
  INPUT = 'input'
}
export interface FormElement {
  id: number;
  payload: {
    font: ObjectKeys<string>;
    text: string;
    type?: string;
  };
  styles: ObjectKeys<FormInputConfigStyles | FormButtonConfigStyles>;
  type: FormElementType;
}

export interface FormInputConfigStyles {
  background: string;
  borderRadius: string;
  color: string;
  font: string;
  fontSize: string;
  height: string;
  letterSpacing: string;
  padding: string;
  textAlign: string;
  border?: string | null;
  boxShadow?: string | null;
}

export interface FormButtonConfigStyles {
  alignItems: string;
  background: string;
  borderRadius: string;
  color: string;
  display: string;
  font: string;
  fontSize: string;
  height: string;
  justifyContent: string;
  letterSpacing: string;
  padding: string;
  textAlign: string;
  boxShadow?: string | null;
  border?: null | string;
}

export interface FormConfig extends ElementConfig {
  styles: ObjectKeys<EmbedConfigStyles>;
  payload: ObjectKeys<string | number>;
  elements: Array<FormElement>;
}

//Video type
export interface VideoConfigStyles {
  borderRadius: string;
  boxShadow?: string | null;
}

export interface VideoConfigPayload extends DefaultPayload {
  url: string;
  isAutoplay?: number;
  isLoop?: number;
  isMute?: number;
}

export interface VideoConfig extends ElementConfig {
  style: ObjectKeys<VideoConfigStyles>;
  payload: VideoConfigPayload;
}
