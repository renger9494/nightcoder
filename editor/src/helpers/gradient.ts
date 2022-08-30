import { cloneDeep as _cloneDeep, isEmpty as _isEmpty } from 'lodash';

/**
 * Create from css gradients linear or radial to js object
 * @param {string} gradient - linear or radial
 * Gradient type Linear linear-gradient(217deg, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)
 * Gradient type Radial radial-gradient(rgba(0,0,255,0.5),rgba(0,0,255,1) 70.71%)
 * @Output {
 *  type: 'linear',
 *  degree: 0,
 *  points: [
 *    {
 *      left: 0,
 *      red: 42,
 *      green: 245,
 *      blue: 152,
 *      alpha: 1
 *    },
 *    {
 *      left: 100,
 *      red: 0,
 *      green: 158,
 *      blue: 253,
 *      alpha: 1
 *    }
 *  ]
 * }
 * */
const convertGradientToObject = function (gradient: string) {
  let str = gradient.substring(gradient.indexOf('(') + 1, gradient.lastIndexOf(')'));

  const splicedGradientArr = str.split(/,(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/);

  const gradientType = gradient.substring(0, gradient.indexOf('-'));

  function _createGradientObj(item: string) {
    let rgba = item
      .replace(/[^0-9.]/g, ' ')
      .split(' ')
      .filter(el => el);
    return {
      left: parseInt(rgba[4]),
      red: parseInt(rgba[0]),
      green: parseInt(rgba[1]),
      blue: parseInt(rgba[2]),
      alpha: parseFloat(rgba[3])
    };
  }

  return {
    type: gradientType,
    degree: gradientType === 'linear' ? parseInt(splicedGradientArr[0].replace(/[a-z]/g, '')) : 0,
    points: splicedGradientArr
      .map((item, index) => {
        if (gradientType === 'linear') {
          if (index > 0) {
            return _createGradientObj(item);
          }
        } else {
          return _createGradientObj(item);
        }
      })
      .filter(e => e)
  };
};

/**
 * Check whether it's Gradient or not using css value
 * @param {string} cssValue - css value
 * @Output Boolean
 * */
const checkGradientByCssValue = (cssValue: string) => {
  const background = _cloneDeep(cssValue);
  if (!background || _isEmpty(background)) return false;
  return background.substring(0, background.indexOf('(')) !== 'rgba';
};

export { convertGradientToObject, checkGradientByCssValue };
