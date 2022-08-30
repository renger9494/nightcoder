import Vue from 'vue';
import { breakpointsWidths } from '@/constants/breakpoints';
import { FileDto } from '../utils/api';
import http from '../utils/http';

/**
 * Функция создаёт реактивно связанные allComponents и components->elements
 */
export const fillAllComponents = (state: any) => {
  Vue.set(state.userConfig, 'allComponents', {});
  for (const block of state.userConfig.components) {
    Vue.set(state.userConfig.allComponents, block.id, block);
    for (const el of block.elements) {
      Vue.set(state.userConfig.allComponents, el.id, el);
    }
  }
};

export const isElementInViewPort = (domElement: HTMLElement, { completely = true } = {}) => {
  const rect = domElement.getBoundingClientRect();

  if (completely)
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

  return (rect.top >= 0 && rect.left >= 0) || (rect.bottom >= 0 && rect.right >= 0);
};

export const getFirstVisibleElement = (elements: any[]) => {
  for (let i = 0; i < elements.length; i++) {
    const htmlElement = document.getElementById(`${elements[i].id}`);
    if (htmlElement && isElementInViewPort(htmlElement)) {
      return elements[i];
    }
  }

  for (let i = 0; i < elements.length; i++) {
    const htmlElement = document.getElementById(`${elements[i].id}`);
    if ((htmlElement && isElementInViewPort(htmlElement), { completely: false })) {
      return elements[i];
    }
  }
};

export const getBlockToPasteDataFromClipboard = (blocks: any[], selectedBlocks: any[]) => {
  if (selectedBlocks.length === 1) return selectedBlocks[0];

  const visibleSelectedBlock = getFirstVisibleElement(selectedBlocks);
  if (visibleSelectedBlock) return visibleSelectedBlock;

  return getFirstVisibleElement(blocks);
};

export const getElementCenterByLocation = (location: { x: number; y: number; w: number; h: number }): ElementCenter => {
  return {
    x: location.x + location.w / 2,
    y: location.y + location.h / 2
  };
};

export const getBlockCenterByStyle = (style: any, breakpointWidth: number): ElementCenter => {
  const heightRex = /^\d*/;
  return {
    x: breakpointWidth / 2,
    y: style.height.match(heightRex) / 2
  };
};

enum ImageFileType {
  Icon = 'icon',
  Image = 'image'
}

export class ImageFile {
  static tryCreate(item: DataTransferItem) {
    if (item.type.indexOf('image') == -1) return null;

    const blob = item.getAsFile();
    if (!blob) return null;

    return new ImageFile(blob);
  }

  private image: FileDto;
  type: ImageFileType;
  constructor(public blob: File) {
    this.image = {} as FileDto;
    this.type = blob.type == 'image/svg+xml' ? ImageFileType.Icon : ImageFileType.Image;
  }

  get isIcon() {
    return this.type == ImageFileType.Icon;
  }

  async upload(url: string) {
    const formData = new FormData();
    formData.append('files', this.blob);

    const { data: images } = await http.post(url, formData);
    this.image = images[0];

    return images[0];
  }

  createLocation(
    blockToPasteImage: any,
    previewMode: string,
    elementCenter: ElementCenter | null,
    imageElementId: number
  ) {
    const blockCenter = getBlockCenterByStyle(blockToPasteImage.styles[previewMode], breakpointsWidths[previewMode]);

    if (this.isIcon) {
      return this.createIconLocation(blockCenter, elementCenter);
    }
    return this.createImageLocation(blockCenter, elementCenter, this.image, imageElementId);
  }

  private createIconLocation(blockCenter: ElementCenter, elementCenter: ElementCenter | null) {
    const ICON_WIDTH = 80;
    const ICON_HEIGHT = 80;
    return {
      x: (elementCenter?.x ?? blockCenter.x) - ICON_WIDTH / 2,
      y: (elementCenter?.y ?? blockCenter.y) - ICON_HEIGHT / 2,
      w: ICON_WIDTH,
      h: ICON_HEIGHT
    };
  }

  private createImageLocation(
    blockCenter: ElementCenter,
    elementCenter: ElementCenter | null,
    image: FileDto,
    imageElementId: number
  ) {
    const imgDomElement: HTMLImageElement | null = document.querySelector(`#${imageElementId} > img`);
    if (!imgDomElement) return null;

    return {
      x: (elementCenter?.x ?? blockCenter.x) - image.width / 2,
      y: (elementCenter?.y ?? blockCenter.y) - image.height / 2,
      w: image.width,
      h: image.height
    };
  }
}

export const proceedDataTransferItems = (dataTransfer: DataTransfer, callback: (image: ImageFile) => void) => {
  for (const item of dataTransfer.items) {
    const imageFile = ImageFile.tryCreate(item);
    if (imageFile) callback(imageFile);
  }
};

export const getSelectedComponentsForClipboard = ({
  selectedElements = [],
  selectedBlocks = []
}: {
  selectedElements: any[];
  selectedBlocks: any[];
}) => {
  return JSON.stringify({
    type: 'userConfig',
    config: {
      selectedElements: selectedElements.map(val => val.element),
      selectedBlocks
    }
  });
};

export const getUserConfigFromClipboard = (clipboardText: string) => {
  try {
    const json = JSON.parse(clipboardText);
    return json.type === 'userConfig' && json;
  } catch (e) {
    return undefined;
  }
};

export const shiftElementLocation = ({
  element,
  shiftX = 10,
  shiftY = 10
}: {
  element: any;
  shiftX: number;
  shiftY: number;
}) => {
  Object.entries(element.location).forEach((breakpoint: any[]) => {
    breakpoint[1].x += shiftX;
    breakpoint[1].y += shiftY;
  });
};

export const changeElementLocationRelativeToNewBlock = (
  element: any,
  blockBounds: { y: number; x: number },
  elemBounds: { y: number; x: number },
  zoom: number
) => {
  Object.values(element.location).forEach((breakpoint: any) => {
    breakpoint.y = ~~(((elemBounds.y - blockBounds.y) / (zoom * 100)) * 100);
    breakpoint.x = ~~(((elemBounds.x - blockBounds.x) / (zoom * 100)) * 100);
  });
};

export type ElementCenter = {
  x: number;
  y: number;
};

export const getPlacesFitToPasteFromClipboard = (state: any) => {
  let block = getBlockToPasteDataFromClipboard(state.userConfig.components, state.selectedBlocks);
  let pasted: null | { center: ElementCenter; element: any } = null;

  if (state.selectedElements.length !== 0) {
    const elementToPaste = getFirstVisibleElement(state.selectedElements.map((selElement: any) => selElement.element));
    if (elementToPaste) {
      block = state.userConfig.allComponents[elementToPaste.parentId];
      pasted = {
        center: getElementCenterByLocation(elementToPaste.location[state.previewMode]),
        element: elementToPaste
      };
    }
  }

  const blockCenter = getBlockCenterByStyle(block.styles[state.previewMode], breakpointsWidths[state.previewMode]);

  return { block, blockCenter, pasted };
};
