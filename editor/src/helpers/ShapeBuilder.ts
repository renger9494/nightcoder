import {
  DefaultPayload,
  ElementConfigLocation,
  ElementsTypes,
  ShapeConfig,
  ShapeConfigStyles
} from '@/utils/types/EditorElements';
import { Color, EffectType, Node, Rectangle } from 'figma-api';
import { breakpointsWidths } from '@/constants/breakpoints';
import { textboxStyleTypes } from '@/constants/textBoxStyle';
import { LinkType, OpenLinkType } from '@/constants/link';
import { figmaToRgbaStyle } from '@/helpers/figmaColorToRgba';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { Vector } from 'figma-api/lib/ast-types';
import { getId } from '@/helpers/randomString';

export class ShapeBuilder {
  private readonly _shapeElementSettings: Node<'ELLIPSE'> | Node<'RECTANGLE'>;
  private readonly _frameAbsoluteBoundingBox: Rectangle;
  private readonly _type: ElementsTypes.RECTANGLE | ElementsTypes.CIRCLE;
  private readonly _breakpoint: string;
  private readonly _zIndex: number | undefined;
  private readonly _parentId: string | undefined;
  constructor({
    shapeElementSettings,
    frameAbsoluteBoundingBox,
    type,
    breakpoint,
    zIndex,
    parentId
  }: {
    shapeElementSettings: Node<'ELLIPSE'> | Node<'RECTANGLE'>;
    frameAbsoluteBoundingBox: Rectangle;
    type: ElementsTypes.RECTANGLE | ElementsTypes.CIRCLE;
    breakpoint: string;
    zIndex?: number;
    parentId?: string;
  }) {
    this._shapeElementSettings = shapeElementSettings;
    this._frameAbsoluteBoundingBox = frameAbsoluteBoundingBox;
    this._type = type;
    this._breakpoint = breakpoint;
    if (zIndex) this._zIndex = zIndex;
    if (parentId) this._parentId = parentId;
  }

  private _calculateFigmaBounds(type: 'x' | 'y') {
    return Math.floor(this._shapeElementSettings.absoluteBoundingBox[type] - this._frameAbsoluteBoundingBox[type]);
  }

  private _pixelToPercent(val: number): number {
    return (Math.floor(val) / breakpointsWidths[this._breakpoint]) * 100;
  }

  private _createBorder(width: number, isDashed: boolean, colorArr: Array<any>): string {
    const type = isDashed ? 'dashed' : 'solid';
    return `${Math.floor(width)}px ${type} ${figmaToRgbaStyle(colorArr[0].color, colorArr[0].color?.a)}`;
  }

  private _createShadow(color: Color, x: number, y: number, blur: number, spread: number): string {
    return `${Math.floor(x)}px ${Math.floor(y)}px ${Math.floor(blur)}px ${Math.floor(spread)}px ${figmaToRgbaStyle(
      color,
      color?.a
    )}`;
  }

  private _createLocation(): ElementConfigLocation {
    const x = this._calculateFigmaBounds('x');

    const { width, height } = this._shapeElementSettings.absoluteBoundingBox;

    return {
      y: this._calculateFigmaBounds('y'),
      x,
      xInPercent: +this._pixelToPercent(x).toFixed(4),
      w: width,
      wInPercent: +this._pixelToPercent(width).toFixed(4),
      h: height,
      a: 0,
      textBoxStyle: textboxStyleTypes.AUTO_HEIGHT
    };
  }

  private _createPayload(): DefaultPayload | undefined {
    if (this._zIndex === undefined) return;
    return {
      zIndex: this._zIndex,
      link: {
        type: LinkType.None,
        openType: OpenLinkType.Blank
      }
    };
  }

  private _createStyles(): ShapeConfigStyles {
    let cornerRadius = null;
    let boxShadow = '';
    const { fills, type, strokes, strokeWeight, strokeDashes, effects } = this._shapeElementSettings;
    const { width, height } = this._shapeElementSettings.absoluteBoundingBox;

    const isFillExists = fills.length && fills[0].color;
    const isStrokesExists = strokes && strokes.length && strokeWeight;
    const isBorderDashed = strokeDashes && strokeDashes.length;
    const isShadowExists = effects && effects.length && effects[0].type === EffectType.DROP_SHADOW;

    if (type !== 'ELLIPSE') {
      cornerRadius = this._shapeElementSettings.cornerRadius ? this._shapeElementSettings.cornerRadius : 0;
    }

    const background: string = isFillExists
      ? figmaToRgbaStyle(fills[0].color as ObjectKeys<number>, fills[0]?.opacity)
      : 'rgba(0,0,0,1)';

    const border = isStrokesExists ? `${this._createBorder(strokeWeight, !!isBorderDashed, strokes)}` : '';

    if (isShadowExists) {
      const color = effects[0].color as Color;
      const offset = effects[0].offset as Vector;
      const blur = effects[0].spread ? effects[0].spread : 0;
      const radius = effects[0].radius ? effects[0].radius : 0;
      boxShadow = this._createShadow(color, offset.x, offset.y, radius, blur);
    }

    return {
      borderRadius: `${cornerRadius !== null ? Math.floor(cornerRadius) : width * height}px`,
      background,
      ...(border ? { border } : {}),
      ...(boxShadow ? { boxShadow } : {})
    };
  }

  build(): ShapeConfig | undefined {
    if (!this._parentId) return;
    const payload = this._createPayload();
    if (!payload) return;
    const location: ObjectKeys<ElementConfigLocation> = {};
    location[this._breakpoint] = this._createLocation();
    const styles: ObjectKeys<ShapeConfigStyles> = {};
    styles[this._breakpoint] = this._createStyles();
    return {
      parentId: this._parentId,
      name: this._shapeElementSettings.name,
      type: this._type,
      id: `${this._type}_${getId()}`,
      location,
      styles,
      payload
    };
  }

  update(shapeElement: ShapeConfig) {
    shapeElement.styles[this._breakpoint] = this._createStyles();
    shapeElement.location[this._breakpoint] = this._createLocation();
  }
}
