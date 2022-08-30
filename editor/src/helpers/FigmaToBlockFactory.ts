import * as Figma from 'figma-api';
import { Node, Rectangle } from 'figma-api';
import { Api } from 'figma-api/lib/api-class';
import { GetFileResult } from 'figma-api/lib/api-types';
import { TextBuilder } from '@/helpers/TextBuilder';
import { getId } from '@/helpers/randomString';
import { ElementsTypes, ImageConfig, ShapeConfig, TextConfig } from '@/utils/types/EditorElements';
import { BlockBuilder } from '@/helpers/BlockBuilder';
import { ImageBuilder } from '@/helpers/ImageBuilder';
import { ShapeBuilder } from '@/helpers/ShapeBuilder';
import ObjectKeys from '@/utils/types/ObjectKeys';

export class FigmaToBlockFactory {
  // private figmaSettings: GetFileResult;
  private readonly figmaApi: Api;
  private readonly fileName: string;
  private readonly _blockId: string = `block_${getId()}`;
  private readonly _apiEndpointIds: ObjectKeys<string>;

  constructor(personalAccessToken: string, fileName: string, apiEndpointIds: ObjectKeys<string>) {
    this.figmaApi = new Figma.Api({ personalAccessToken });
    this.fileName = fileName;
    this._apiEndpointIds = apiEndpointIds;
  }

  private _getFigmaBlockConfig(): Promise<GetFileResult> {
    return this.figmaApi.getFile(this.fileName);
  }

  private _createText(
    textElementSettings: Node<'TEXT'>,
    breakpoint: string,
    zIndex: number,
    frameAbsoluteBoundingBox: Rectangle
  ): TextConfig | undefined {
    return new TextBuilder({
      textElementSettings,
      frameAbsoluteBoundingBox,
      breakpoint,
      zIndex,
      parentId: this._blockId
    }).build();
  }

  private _updateText(
    textElementSettings: Node<'TEXT'>,
    breakpoint: string,
    frameAbsoluteBoundingBox: Rectangle,
    blockConfigElement: TextConfig
  ): void {
    new TextBuilder({
      textElementSettings,
      frameAbsoluteBoundingBox,
      breakpoint
    }).update(blockConfigElement);
  }

  private async _createImage(
    imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>,
    breakpoint: string,
    zIndex: number,
    frameAbsoluteBoundingBox: Rectangle
  ): Promise<ImageConfig | undefined> {
    return await new ImageBuilder({
      imageElementSettings,
      frameAbsoluteBoundingBox,
      breakpoint,
      zIndex,
      figmaApi: this.figmaApi,
      fileName: this.fileName,
      parentId: this._blockId,
      apiEndpointIds: this._apiEndpointIds
    }).build();
  }

  private _updateImage(
    imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>,
    breakpoint: string,
    frameAbsoluteBoundingBox: Rectangle,
    imageElement: ImageConfig
  ): void {
    return new ImageBuilder({ imageElementSettings, breakpoint, frameAbsoluteBoundingBox }).update(imageElement);
  }

  private async _createIcon(
    imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>,
    breakpoint: string,
    zIndex: number,
    frameAbsoluteBoundingBox: Rectangle
  ): Promise<ImageConfig | undefined> {
    return await new ImageBuilder({
      imageElementSettings,
      frameAbsoluteBoundingBox,
      breakpoint,
      zIndex,
      figmaApi: this.figmaApi,
      fileName: this.fileName,
      parentId: this._blockId,
      apiEndpointIds: this._apiEndpointIds,
      isIcon: true
    }).build();
  }

  private _updateIcon(
    imageElementSettings: Node<'GROUP'> | Node<'RECTANGLE'>,
    breakpoint: string,
    frameAbsoluteBoundingBox: Rectangle,
    imageElement: ImageConfig
  ): void {
    return new ImageBuilder({ imageElementSettings, breakpoint, frameAbsoluteBoundingBox }).update(imageElement);
  }

  private _createButton(buttonElementSettings: any): any {
    return buttonElementSettings;
  }

  private _createRect(
    rectElementSettings: Node<'RECTANGLE'>,
    breakpoint: string,
    zIndex: number,
    frameAbsoluteBoundingBox: Rectangle
  ): ShapeConfig | undefined {
    return new ShapeBuilder({
      shapeElementSettings: rectElementSettings,
      breakpoint,
      zIndex,
      frameAbsoluteBoundingBox,
      type: ElementsTypes.RECTANGLE,
      parentId: this._blockId
    }).build();
  }

  private _updateRect(
    rectElementSettings: Node<'RECTANGLE'>,
    breakpoint: string,
    frameAbsoluteBoundingBox: Rectangle,
    elementSettings: ShapeConfig
  ): void {
    return new ShapeBuilder({
      shapeElementSettings: rectElementSettings,
      breakpoint,
      frameAbsoluteBoundingBox,
      type: ElementsTypes.RECTANGLE
    }).update(elementSettings);
  }

  private _createCircle(
    rectElementSettings: Node<'ELLIPSE'>,
    breakpoint: string,
    zIndex: number,
    frameAbsoluteBoundingBox: Rectangle
  ): ShapeConfig | undefined {
    return new ShapeBuilder({
      shapeElementSettings: rectElementSettings,
      breakpoint,
      zIndex,
      frameAbsoluteBoundingBox,
      type: ElementsTypes.CIRCLE,
      parentId: this._blockId
    }).build();
  }

  private _updateCircle(
    rectElementSettings: Node<'ELLIPSE'>,
    breakpoint: string,
    frameAbsoluteBoundingBox: Rectangle,
    elementSettings: ShapeConfig
  ): void {
    return new ShapeBuilder({
      shapeElementSettings: rectElementSettings,
      breakpoint,
      frameAbsoluteBoundingBox,
      type: ElementsTypes.CIRCLE
    }).update(elementSettings);
  }

  private _createBlock(blockElementSettings: Node<'FRAME'>, breakpoint: string): any {
    return new BlockBuilder({
      id: this._blockId,
      blockElementSettings,
      breakpoint,
      apiEndpointIds: this._apiEndpointIds
    }).build();
  }

  private _updateBlock(blockElementSettings: Node<'FRAME'>, breakpoint: string, blockConfig: any): any {
    return new BlockBuilder({ id: this._blockId, blockElementSettings, breakpoint }).update(blockConfig);
  }

  private async _createBlockUserConfig(figmaSettings: GetFileResult): Promise<any> {
    const canvas = figmaSettings.document.children[0] as Node<'CANVAS'>;
    let blockConfig: any = {};
    for (const canvasFrame of canvas.children) {
      const frame = canvasFrame as Node<'FRAME'>;

      if (frame.type === 'FRAME') {
        if (frame.name.includes('desktop')) {
          blockConfig = this._createBlock(frame, 'laptop');
        } else {
          this._updateBlock(frame, frame.name, blockConfig);
        }

        for (const [index, frameElement] of frame.children.entries()) {
          const element = frameElement as Node<'TEXT' | 'RECTANGLE' | 'GROUP' | 'ELLIPSE' | 'FRAME' | 'VECTOR'>;
          const elementType: string = element.name.split('_')[0];

          if (elementType === 'text' && element.type === 'TEXT') {
            if (frame.name.includes('desktop')) {
              const newText = this._createText(
                frameElement as Node<'TEXT'>,
                'laptop',
                index,
                frame.absoluteBoundingBox
              );
              blockConfig.elements.push(newText);
            } else {
              const blockConfigElement = blockConfig.elements.find((item: any) => item.name === element.name);
              this._updateText(frameElement as Node<'TEXT'>, frame.name, frame.absoluteBoundingBox, blockConfigElement);
            }
          }

          if (elementType === 'image' && (element.type === 'GROUP' || element.type === 'RECTANGLE')) {
            if (frame.name.includes('desktop')) {
              const newImage = await this._createImage(
                frameElement as Node<'GROUP'> | Node<'RECTANGLE'>,
                'laptop',
                index,
                frame.absoluteBoundingBox
              );
              if (newImage) blockConfig.elements.push(newImage);
            } else {
              const blockConfigElement = blockConfig.elements.find((item: any) => item.name === element.name);
              this._updateImage(
                frameElement as Node<'GROUP'> | Node<'RECTANGLE'>,
                frame.name,
                frame.absoluteBoundingBox,
                blockConfigElement
              );
            }
          }

          if (
            elementType === 'icon' &&
            (element.type === 'GROUP' ||
              element.type === 'RECTANGLE' ||
              element.type === 'FRAME' ||
              element.type === 'VECTOR')
          ) {
            if (frame.name.includes('desktop')) {
              const newImage = await this._createIcon(
                frameElement as Node<'GROUP'> | Node<'RECTANGLE'>,
                'laptop',
                index,
                frame.absoluteBoundingBox
              );
              if (newImage) blockConfig.elements.push(newImage);
            } else {
              const blockConfigElement = blockConfig.elements.find((item: any) => item.name === element.name);
              this._updateIcon(
                frameElement as Node<'GROUP'> | Node<'RECTANGLE'>,
                frame.name,
                frame.absoluteBoundingBox,
                blockConfigElement
              );
            }
          }

          if (elementType === 'rect' || (elementType === 'rectangle' && element.type === 'RECTANGLE')) {
            if (frame.name.includes('desktop')) {
              const newRect = this._createRect(
                frameElement as Node<'RECTANGLE'>,
                'laptop',
                index,
                frame.absoluteBoundingBox
              );
              if (newRect) blockConfig.elements.push(newRect);
            } else {
              const blockConfigElement = blockConfig.elements.find((item: any) => item.name === element.name);
              this._updateRect(
                frameElement as Node<'RECTANGLE'>,
                frame.name,
                frame.absoluteBoundingBox,
                blockConfigElement
              );
            }
          }

          if (elementType === 'circle' && element.type === 'ELLIPSE') {
            if (frame.name.includes('desktop')) {
              const newRect = this._createCircle(
                frameElement as Node<'ELLIPSE'>,
                'laptop',
                index,
                frame.absoluteBoundingBox
              );
              if (newRect) blockConfig.elements.push(newRect);
            } else {
              const blockConfigElement = blockConfig.elements.find((item: any) => item.name === element.name);
              this._updateCircle(
                frameElement as Node<'ELLIPSE'>,
                frame.name,
                frame.absoluteBoundingBox,
                blockConfigElement
              );
            }
          }
        }
      }
    }

    return blockConfig;
  }

  async getBlockConfig(): Promise<any> {
    try {
      const figmaSettings = await this._getFigmaBlockConfig();
      return await this._createBlockUserConfig(figmaSettings);
    } catch (e) {
      return e;
    }
  }
}
