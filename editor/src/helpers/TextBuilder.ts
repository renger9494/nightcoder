import { Node, Rectangle } from 'figma-api';
import {
  ElementConfigLocation,
  ElementsTypes,
  TextConfig,
  TextConfigPayload,
  TextConfigStyles
} from '@/utils/types/EditorElements';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { textboxStyleTypes } from '@/constants/textBoxStyle';
import { LinkType, OpenLinkType } from '@/constants/link';
import { breakpointsWidths } from '@/constants/breakpoints';
import filteredData from '@/helpers/font/fontImporter';
import { getId } from '@/helpers/randomString';
import { figmaToRgbaStyle } from '@/helpers/figmaColorToRgba';

export class TextBuilder {
  private readonly _textElementSettings: Node<'TEXT'>;
  private readonly _parentId: string | undefined;
  private readonly _breakpoint: string;
  private readonly _zIndex: number | undefined;
  private readonly _frameAbsoluteBoundingBox: Rectangle;
  private readonly _alignProps = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center',
    JUSTIFIED: 'justified'
  };

  constructor({
    textElementSettings,
    frameAbsoluteBoundingBox,
    breakpoint,
    parentId,
    zIndex
  }: {
    textElementSettings: Node<'TEXT'>;
    frameAbsoluteBoundingBox: Rectangle;
    breakpoint: string;
    parentId?: string;
    zIndex?: number;
  }) {
    this._textElementSettings = textElementSettings;
    this._breakpoint = breakpoint;
    this._frameAbsoluteBoundingBox = frameAbsoluteBoundingBox;
    if (zIndex !== undefined) this._zIndex = zIndex;
    if (parentId) this._parentId = parentId;
  }

  private _calculateFigmaBounds(type: 'x' | 'y') {
    return Math.floor(this._textElementSettings.absoluteBoundingBox[type] - this._frameAbsoluteBoundingBox[type]);
  }

  private _pixelToPercent(val: number): number {
    return (Math.floor(val) / breakpointsWidths[this._breakpoint]) * 100;
  }

  private _createLocation(): ElementConfigLocation {
    const x = this._calculateFigmaBounds('x');

    const { width, height } = this._textElementSettings.absoluteBoundingBox;
    const { letterSpacing } = this._textElementSettings.style;
    const realWidth = letterSpacing > 0 ? letterSpacing : 2;

    return {
      y: this._calculateFigmaBounds('y'),
      x,
      xInPercent: +this._pixelToPercent(x).toFixed(4),
      w: Math.floor(width + realWidth),
      wInPercent: +this._pixelToPercent(width + realWidth).toFixed(4),
      h: height,
      a: 0,
      textBoxStyle: textboxStyleTypes.AUTO_HEIGHT
    };
  }

  private _createPayload(): TextConfigPayload | undefined {
    if (this._zIndex === undefined) return;
    const font: ObjectKeys<string> = {};
    font[this._breakpoint] = this._textElementSettings.style.fontFamily;
    return {
      type: 'p',
      isContentChanged: false,
      font,
      content: this._textElementSettings.characters,
      zIndex: this._zIndex,
      link: {
        type: LinkType.None,
        openType: OpenLinkType.Blank
      }
    };
  }

  private _createStyles(): TextConfigStyles {
    const fills = this._textElementSettings.fills;
    const color: string =
      fills.length && fills[0].color ? figmaToRgbaStyle(fills[0].color, fills[0]?.opacity) : 'rgba(0,0,0,1)';
    const {
      letterSpacing,
      lineHeightPx,
      fontSize,
      textAlignHorizontal,
      fontWeight,
      fontFamily,
      italic
    } = this._textElementSettings.style;

    const font = filteredData.find(item => item.family === fontFamily);

    return {
      alignItems: 'flex-start',
      letterSpacing: `${Math.floor(letterSpacing)}px`,
      font: `${italic ? 'italic' : 'normal'} ${fontWeight} ${Math.floor(fontSize)}px/${Math.floor(lineHeightPx)}px "${
        font ? fontFamily : 'Inter'
      }", ${font ? font.category : 'sans-serif'}`,
      fontSize: `${this._pixelToPercent(fontSize).toFixed(4)}vw`,
      color,
      textAlign: this._alignProps[textAlignHorizontal]
    };
  }

  update(textElement: TextConfig): void {
    textElement.styles[this._breakpoint] = this._createStyles();
    textElement.location[this._breakpoint] = this._createLocation();
    textElement.payload.font[this._breakpoint] = this._textElementSettings.style.fontFamily;
  }

  build(): TextConfig | undefined {
    if (!this._parentId) return;
    const payload = this._createPayload();
    if (!payload) return;
    const location: ObjectKeys<ElementConfigLocation> = {};
    location[this._breakpoint] = this._createLocation();
    const styles: ObjectKeys<TextConfigStyles> = {};
    styles[this._breakpoint] = this._createStyles();
    return {
      parentId: this._parentId,
      name: this._textElementSettings.name,
      type: ElementsTypes.TEXT,
      id: `text_${getId()}`,
      location,
      styles,
      payload
    };
  }
}
