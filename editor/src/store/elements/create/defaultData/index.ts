import { textStyles, textLocation, textPayload } from './text';
import { buttonStyles, buttonLocation, buttonPayload } from './button';
import { imageStyles, imageLocation, imagePayload } from './image';
import { rectangleStyles, rectangleLocation, rectanglePayload } from './rectangle';
import { iconStyles, iconLocation, iconPayload } from './icon';
import { embedStyles, embedLocation, embedPayload } from './embed';
import { circleStyles, circleLocation, circlePayload } from './circle';
import { formStyles, formLocation, formPayload, formElements } from './form';
import { videoStyles, videoLocation, videoPayload } from './video';
import ObjectKeys from '@/utils/types/ObjectKeys';

import { PayloadLink, LinkType, OpenLinkType } from '@/constants/link';

const defaultPayload = (el: string) => {
  const payloads: ObjectKeys<Function> = {
    textPayload,
    buttonPayload,
    imagePayload,
    rectanglePayload,
    iconPayload,
    embedPayload,
    circlePayload,
    formPayload,
    videoPayload
  };
  return payloads[`${el}Payload`]();
};

const defaultStyles = (el: string) => {
  const styles: ObjectKeys<Function> = {
    textStyles,
    buttonStyles,
    imageStyles,
    rectangleStyles,
    iconStyles,
    circleStyles,
    embedStyles,
    formStyles,
    videoStyles
  };
  return styles[`${el}Styles`]();
};

const defaultLocation = (el: any, coords?: { x: number; y: number }) => {
  const locations: ObjectKeys<Function> = {
    textLocation,
    buttonLocation,
    imageLocation,
    rectangleLocation,
    iconLocation,
    circleLocation,
    embedLocation,
    formLocation,
    videoLocation
  };
  return locations[`${el}Location`](coords);
};

const defaultElements = (el: string) => {
  const styles: ObjectKeys<Function> = {
    formElements
  };
  return styles[`${el}Elements`]();
};

const defaultLink = (): PayloadLink => {
  return {
    type: LinkType.None,
    openType: OpenLinkType.Blank
  };
};

const defaultZindex = (block?: { elements?: any[] }) => {
  if (block === undefined || block.elements === undefined || block.elements.length === 0) return 1;

  function findMaxIndex() {
    let maxZIndex = 1;
    block?.elements?.forEach(value => {
      if (maxZIndex < value.payload.zIndex) maxZIndex = value.payload.zIndex;
    });
    return maxZIndex;
  }

  return findMaxIndex() + 1;
};

export { defaultStyles, defaultLocation, defaultPayload, defaultLink, defaultZindex, defaultElements };
