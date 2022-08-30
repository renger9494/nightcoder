import { DirectiveBinding } from 'vue/types/options';

const GUTTER_Y = 20;
const GUTTER_X = 5;
const SCROLL_BAR_SIZE = 16;

const clearElem = () => {
  const text = document.querySelector('#tooltip');
  if (text) text.classList.remove('active');
};

const showElement = (event: MouseEvent, htmlElem: HTMLElement, textValue: any) => {
  const myMouseX = event.clientX;
  const myMouseY = event.clientY;
  const text: HTMLElement | null = document.querySelector('#tooltip');
  if (text) {
    if (typeof textValue === 'string') {
      text.innerHTML = textValue;
    } else {
      text.innerHTML = `<span>${textValue.text}</span> <span>${textValue.highlite}</span>`;
    }
    text.classList.add('active');
    const rectText = text.getBoundingClientRect();
    const posittionY = myMouseY + GUTTER_Y;
    let posittionX = myMouseX - GUTTER_X;
    const coordinateXSize = posittionX + rectText.width;
    if (coordinateXSize > window.innerWidth - SCROLL_BAR_SIZE) posittionX = myMouseX - rectText.width;
    text.style.top = `${posittionY}px`;
    text.style.left = `${posittionX}px`;
  }
};

const creatTooltip = () => {
  const body = document.getElementsByTagName('body')[0];
  const text = document.createElement('p');
  text.id = 'tooltip';
  text.classList.add('v-tooltip');
  body.appendChild(text);
};

creatTooltip();

export default {
  bind: (el: HTMLElement, binding: DirectiveBinding) => {
    if (!binding.value) return;
    (el as any).__vHoverOver__ = (e: MouseEvent) => {
      showElement(e, el, binding.value);
    };
    (el as any).__vHoverLeave__ = () => {
      clearElem();
    };

    // Add Event Listeners
    el.addEventListener('mousemove', (el as any).__vHoverOver__);
    el.addEventListener('mouseleave', (el as any).__vHoverLeave__);
  },
  unbind: (el: HTMLElement, binding: DirectiveBinding) => {
    if (!binding.value) return;
    el.removeEventListener('mousemove', (el as any).__vHoverOver__);
    el.removeEventListener('mouseleave', (el as any).__vHoverLeave__);
    delete (el as any).__vHoverOver__;
    delete (el as any).__vHoverLeave__;
  }
};
