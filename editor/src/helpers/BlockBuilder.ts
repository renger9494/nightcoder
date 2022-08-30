import { Node } from 'figma-api';
import ObjectKeys from '@/utils/types/ObjectKeys';
import { figmaToRgbaStyle } from '@/helpers/figmaColorToRgba';

export class BlockBuilder {
  private readonly _id: string;
  private readonly _blockElementSettings: Node<'FRAME'>;
  private readonly _breakpoint: string;
  private readonly _apiEndpointIds?: ObjectKeys<string> | undefined;

  constructor({
    id,
    blockElementSettings,
    breakpoint,
    apiEndpointIds
  }: {
    id: string;
    blockElementSettings: Node<'FRAME'>;
    breakpoint: string;
    apiEndpointIds?: ObjectKeys<string>;
  }) {
    this._id = id;
    this._blockElementSettings = blockElementSettings;
    this._breakpoint = breakpoint;
    if (apiEndpointIds) this._apiEndpointIds = apiEndpointIds;
  }

  private _createStyles(): any {
    const { background } = this._blockElementSettings;
    const colorBG: string =
      background && background.length && background[0].color
        ? figmaToRgbaStyle(background[0].color, background[0]?.opacity)
        : 'rgba(0,0,0,1)';
    return {
      height: `${this._blockElementSettings.absoluteBoundingBox.height}px`,
      heightType: 'fixed',
      background: colorBG,
      objectFit: 'cover',
      opacity: 1,
      backgroundPosition: '50%',
      backgroundRepeat: 'no-repeat',
      overflow: this._blockElementSettings.clipsContent ? 'hidden' : 'visible'
    };
  }

  build(): any {
    const styles: ObjectKeys<any> = {};
    styles[this._breakpoint] = this._createStyles();
    const dbId = this._apiEndpointIds?.blockId ? this._apiEndpointIds?.blockId : -1;
    return {
      type: 'block',
      id: this._id,
      dbId,
      sortId: 1,
      name: this._blockElementSettings.name,
      parentComp: undefined,
      parentId: undefined,
      payload: {},
      styles,
      elements: []
    };
  }

  update(blockConfig: any): void {
    blockConfig.styles[this._breakpoint] = this._createStyles();
  }
}
