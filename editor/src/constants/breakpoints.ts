import ObjectKeys from "../utils/types/ObjectKeys";

/**
 * Брейкпоинты экранов отсортированы по размеру экрана от самого большого
 */
export const breakpoints = [
  { name: 'laptop', width: '' },
  { name: 'tablet', width: '768' },
  { name: 'mobile', width: '375' }
];

export const publishCssBrakePoints = [
  { name: 'laptop', width: '' },
  { name: 'tablet', width: '1024' },
  { name: 'mobile', width: '660' }
];

export const customQueries = [
  { name: 'laptop', maxWidth: '1279', minWidth: '1024' },
  { name: 'tablet', maxWidth: '767', minWidth: '660' },
  { name: 'mobile', maxWidth: '375', minWidth: '280' }
];

export const defaultContainerWidthForLaptop = 1280;
export const breakpointNames = breakpoints.map(val => val.name);
export const breakpointsWidths = breakpoints.reduce((result: ObjectKeys<number>, current) => {
  result[current.name] = parseInt(current.width) || defaultContainerWidthForLaptop;
  return result;
}, {});

export default breakpointNames;
