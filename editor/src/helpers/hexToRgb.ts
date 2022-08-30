export default function hexToRgb(hex: null | string) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}

export const rgbaToHexOpacity = function (rawrgba: string) {
  function convertToHexo(rgba: string[]) {
    const hex = '#' + makeHex(rgba[0]) + makeHex(rgba[1]) + makeHex(rgba[2]);
    if (+rgba[3] >= 1) {
      rgba[3] = '1';
    }

    return { hex, opacity: +rgba[3] };
  }

  function makeHex(item: string) {
    return ('0' + parseInt(item, 10).toString(16)).slice(-2);
  }

  const values = rawrgba
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');

  return convertToHexo(values);
};

export const getRgba = function (color: string | null, opacity: null | undefined | number) {
  const rgb = hexToRgb(color);
  if (!rgb || opacity === null || opacity === undefined) return 'rgba(0,0,0,1)';
  return `rgba(${Object.values(rgb).join(',')},${opacity})`;
};

export const prepareOpacity = function (opacity: string) {
  if (isNaN(+opacity))
    return 0;
  if (+opacity > 100) {
    return 1;
  }
  if (+opacity < 0) {
    return 0;
  }
  return +opacity / 100;
};
