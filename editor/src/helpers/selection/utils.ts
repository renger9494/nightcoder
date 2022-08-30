/* eslint-disable prefer-rest-params */
function eventListener(method: string, elements: HTMLCollection | NodeList | HTMLElement, events: string[] | string, fn: Function, options = {}) {
  // Normalize array
  let htmlElements: Node[] = [];
  if (elements instanceof HTMLCollection || elements instanceof NodeList) {
    htmlElements = Array.from(elements);
  } else if (!Array.isArray(elements)) {
    htmlElements = [elements];
  }

  if (!Array.isArray(events)) {
    events = [events];
  }

  for (const element of htmlElements) {
    for (const event of events) {
      (<any>element)[method](event, fn, { capture: false, ...options });
    }
  }

  return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

const unitify = (val: number | string, unit = 'px') => (typeof val === 'number' ? val + unit : val);

/**
 * Add css to a DOM-Element or returns the current
 * value of a property.
 *
 * @param el The Element.
 * @param attr The attribute or a object which holds css key-properties.
 * @param val The value for a single attribute.
 */
export function css(el: HTMLElement, attr: string | object, val: number | string): void {
  const style = el && el.style;
  if (style) {
    if (typeof attr === 'object') {
      for (const [key, value] of Object.entries(attr)) {
        style.setProperty(key, unitify(value));
      }
    } else if (val && typeof attr === 'string') {
      style.setProperty(attr, unitify(val));
    }
  }
}

/**
 * Check if two DOM-Elements intersects each other.
 * @param a BoundingClientRect of the first element.
 * @param b BoundingClientRect of the second element.
 * @param mode Options are center, cover or touch.
 * @returns {boolean} If both elements intersects each other.
 */
export function intersects(a: DOMRect, b: DOMRect, mode: "touch" | "center" | "cover") {
  switch (mode || 'touch') {
    case 'center': {
      const bxc = b.left + b.width / 2;
      const byc = b.top + b.height / 2;

      return bxc >= a.left && bxc <= a.right && byc >= a.top && byc <= a.bottom;
    }
    case 'cover': {
      return b.left >= a.left && b.top >= a.top && b.right <= a.right && b.bottom <= a.bottom;
    }
    case 'touch': {
      return a.right >= b.left && a.left <= b.right && a.bottom >= b.top && a.top <= b.bottom;
    }
    default: {
      throw new Error(`Unknown intersection mode: ${mode}`);
    }
  }
}

/**
 * Takes a selector (or array of selectors) and returns the matched nodes.
 * @param selector The selector or an Array of selectors.
 * @returns {Array} Array of DOM-Nodes.
 */
export function selectAll(selector: any | any[], doc = document) {
  if (!Array.isArray(selector)) {
    selector = [selector];
  }

  const nodes = [];
  for (let i = 0, l = selector.length; i < l; i++) {
    const item = selector[i];

    if (typeof item === 'string') {
      nodes.push(...doc.querySelectorAll(item));
    } else if (item instanceof HTMLElement) {
      nodes.push(item);
    }
  }

  return nodes;
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt: any) {
  let path = evt.path || (evt.composedPath && evt.composedPath());

  if (path) {
    return path;
  }

  let el = evt.target;
  for (path = [el]; (el = el.parentElement);) {
    path.push(el);
  }

  path.push(document, window);
  return path;
}

/**
 * Removes an element from an Array.
 */
export function removeElement(arr: any[], el: any) {
  const index = arr.indexOf(el);

  if (~index) {
    arr.splice(index, 1);
  }
}

export function simplifyEvent(evt: TouchEvent) {
  const tap = (evt.touches && evt.touches[0]) || evt;
  return {
    tap,
    x: tap.clientX,
    y: tap.clientY,
    target: tap.target
  };
}
