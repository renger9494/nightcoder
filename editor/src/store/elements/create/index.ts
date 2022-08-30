import { getId } from '@/helpers/randomString';
import breakpoints from '@/constants/breakpoints';

import {
  defaultLink,
  defaultLocation,
  defaultStyles,
  defaultZindex,
  defaultPayload,
  defaultElements
} from './defaultData';

export enum ElementType {
  Icon = 'icon',
  Image = 'image',
  Text = 'text',
  Button = 'button',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Embed = 'embed',
  Form = 'form',
  Video = 'video'
}

const createElement = (
  { commit, state }: { commit: Function; state: any },
  {
    element,
    block,
    coords,
    payload
  }: { element: ElementType; block: any; coords?: { x: number; y: number }; payload: any }
) => {
  commit('changeEditorHistory', {
    oldConfig: state.userConfig
  });

  //TODO: element config to type
  const elementConfig = {
    parentId: block.id,
    name: element, //name maybe different than element type
    type: element,
    id: `${element}_${getId()}`,
    payload: {
      ...{ ...defaultPayload(element), ...payload },
      zIndex: defaultZindex(state.userConfig.allComponents[block.id]),
      link: {
        ...defaultLink()
      }
    },
    styles: {
      ...defaultStyles(element)
    },
    location: {
      ...defaultLocation(element, coords)
    },
    ...(element === 'form' ? { elements: defaultElements(element) } : {})
  };

  commit('addCreatedElementToBlock', { element: elementConfig, blockID: block.id });
  if (['text', 'form'].includes(element)) commit('actualiseFontList');
  breakpoints.forEach(breakpoint => {
    commit('setDisplayCondition', {
      id: elementConfig.id,
      condition: 'hideElement',
      value: false,
      previewMode: breakpoint
    });
  });

  return elementConfig;
};

const addCreatedElementToBlock = (state: any, { element, blockID }: { element: any; blockID: string }) => {
  const compBlock = state.userConfig.components.find((blk: any) => blk.id === blockID);
  compBlock.elements.push(element);
  state.userConfig.allComponents[element.id] = compBlock.elements[compBlock.elements.length - 1];
};

export { createElement, addCreatedElementToBlock };
