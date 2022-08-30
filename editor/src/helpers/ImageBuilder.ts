import { Color, Node, Rectangle } from 'figma-api';
import { breakpointsWidths } from '@/constants/breakpoints';
import {
  ElementConfigLocation,
  ElementsTypes,
  ImageConfig,
  ImageConfigPayload,
  ImageConfigPayloadDefaultImage,
  ImageConfigStyles
} from '@/utils/types/EditorElements';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { LinkType, OpenLinkType } from '@/constants/link';
import { getId } from '@/helpers/randomString';
import { Api } from 'figma-api/lib/api-class';
import { FileDto } from '@/utils/api';
import http from '@/utils/http';
import axios from 'axios';
import { Converter } from '@/utils/converter';
import { figmaToRgbaStyle } from '@/helpers/figmaColorToRgba';

export class ImageBuilder {
  private readonly _imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>;
  private readonly _frameAbsoluteBoundingBox: Rectangle;
  private readonly _breakpoint: string;
  private readonly _zIndex: number | undefined;
  private readonly _parentId: string | undefined;
  private readonly _fileName: string | undefined;
  private readonly _figmaApi: Api | undefined;
  private readonly _apiEndpointIds: ObjectKeys<string> | undefined;
  private readonly _isIcon: boolean = false;
  private readonly DEFAULT_IMAGE = {
    fullPath: 'https://s3.amazonaws.com/beta.airtap.io/Defaults/imgelement.jpg',
    fullPathJp2: 'https://s3.amazonaws.com/beta.airtap.io/Defaults/imgelement.jpg',
    fullPathWebP: 'https://s3.amazonaws.com/beta.airtap.io/Defaults/imgelement.jpg'
  };

  constructor({
    imageElementSettings,
    frameAbsoluteBoundingBox,
    breakpoint,
    zIndex,
    parentId,
    figmaApi,
    fileName,
    apiEndpointIds,
    isIcon
  }: {
    imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>;
    frameAbsoluteBoundingBox: Rectangle;
    breakpoint: string;
    zIndex?: number;
    parentId?: string;
    figmaApi?: Api;
    fileName?: string;
    apiEndpointIds?: ObjectKeys<string>;
    isIcon?: boolean;
  }) {
    this._imageElementSettings = imageElementSettings;
    this._frameAbsoluteBoundingBox = frameAbsoluteBoundingBox;
    this._breakpoint = breakpoint;
    if (zIndex !== undefined) this._zIndex = zIndex;
    if (parentId) this._parentId = parentId;
    if (figmaApi) this._figmaApi = figmaApi;
    if (fileName) this._fileName = fileName;
    if (apiEndpointIds) this._apiEndpointIds = apiEndpointIds;
    if (isIcon) this._isIcon = isIcon;
  }

  private async _getFigmaImage(
    ids: string,
    format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png'
  ): Promise<{ images: { [nodeId: string]: string | null } }> {
    const defaultResponse = { images: { [ids]: null } };
    if (!this._figmaApi || !this._fileName) return new Promise(resolve => resolve(defaultResponse));
    const scale: number = format !== 'svg' ? 2 : 1;
    try {
      const { images } = await this._figmaApi.getImage(this._fileName, { ids, format, scale });
      return { images };
    } catch (e) {
      return defaultResponse;
    }
  }

  private async _uploadImageToAirtap(formData: FormData): Promise<FileDto | null> {
    if (!this._apiEndpointIds) return null;
    const { blockId, projectId, pageId } = this._apiEndpointIds;
    let url = '';

    if (blockId) url = `/api/interface/Block/${blockId}/elementImage`;
    else url = `/api/projects/${projectId}/pages/${pageId}/elementImage`;

    if (!url) return null;

    try {
      const { data: elementImage } = await http.put(url, formData);
      const image = elementImage;
      delete image.fullPathJp2;
      delete image.fullPathWebP;
      image.fullPathWebP = false;
      image.isHasWebP = false;
      return elementImage;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private async _getFigmaImageInBlob(url: string): Promise<FormData | null> {
    try {
      const { data } = (await axios.get(url, { responseType: 'blob' })) as any;
      const payload = {
        Image: new File([data], `figma_image_${this._imageElementSettings.name}${this._isIcon ? '.svg' : ''}`)
      } as { Image: File };
      return Converter.jsonToFormData(payload);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  private _getImageDto(id: string): Promise<FileDto | null> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const { images } = await this._getFigmaImage(id, this._isIcon ? 'svg' : 'png');
      if (images[id] === null) return reject(null);
      const formData = await this._getFigmaImageInBlob(images[id] as string);
      if (formData === null) return reject(null);
      const fileDto = await this._uploadImageToAirtap(formData);
      if (fileDto === null) return reject(null);
      return resolve(fileDto);
    });
  }

  private _calculateFigmaBounds(type: 'x' | 'y') {
    return Math.floor(this._imageElementSettings.absoluteBoundingBox[type] - this._frameAbsoluteBoundingBox[type]);
  }

  private _pixelToPercent(val: number): number {
    return (Math.floor(val) / breakpointsWidths[this._breakpoint]) * 100;
  }

  private _createLocation(): ElementConfigLocation {
    const x = this._calculateFigmaBounds('x');
    const { width, height } = this._imageElementSettings.absoluteBoundingBox;
    return {
      y: this._calculateFigmaBounds('y'),
      x,
      xInPercent: +this._pixelToPercent(x).toFixed(4),
      w: Math.floor(width),
      wInPercent: +this._pixelToPercent(width).toFixed(4),
      h: Math.floor(height),
      a: 0
    };
  }

  private _createStyles(): ImageConfigStyles {
    const { cornerRadius, opacity } = this._imageElementSettings;

    //In case if you need overlay uncomment this logic
    // const color = fills.find(item => typeof item.color?.r === 'number');
    //
    // const overlay = color ? figmaToRgbaStyle(color.color as Color, color?.opacity) : null;

    return {
      borderRadius: cornerRadius ? `${Math.floor(cornerRadius)}px` : '0px',
      objectFit: 'cover',
      opacity: opacity ? opacity : 1
      //TODO: create image overlay style logic
      // ...(overlay ? { overlay } : {})
    };
  }

  private async _createPayload(): Promise<ImageConfigPayload | undefined> {
    if (this._zIndex === undefined) return;
    let image: FileDto | ImageConfigPayloadDefaultImage = this.DEFAULT_IMAGE;
    const fileDto = await this._getImageDto(this._imageElementSettings.id);

    if (fileDto !== null) {
      image = fileDto;
    }

    return {
      image,
      zIndex: this._zIndex,
      link: {
        type: LinkType.None,
        openType: OpenLinkType.Blank
      }
    };
  }

  async build(): Promise<ImageConfig | undefined> {
    if (!this._parentId) return;
    const payload = await this._createPayload();
    if (!payload) return;
    const location: ObjectKeys<ElementConfigLocation> = {};
    location[this._breakpoint] = this._createLocation();
    const styles: ObjectKeys<ImageConfigStyles> = {};
    styles[this._breakpoint] = this._createStyles();
    return {
      parentId: this._parentId,
      name: this._imageElementSettings.name,
      type: !this._isIcon ? ElementsTypes.IMAGE : ElementsTypes.ICON,
      id: `${!this._isIcon ? 'icon' : 'image'}_${getId()}`,
      location,
      styles,
      payload
    };
  }

  update(imageElement: ImageConfig): void {
    imageElement.styles[this._breakpoint] = this._createStyles();
    imageElement.location[this._breakpoint] = this._createLocation();
  }
}
