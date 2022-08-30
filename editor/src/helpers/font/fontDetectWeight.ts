import ObjectKeys from "@/utils/types/ObjectKeys";

/*
 * @param {string} type
 */
export default (type: string) => {
  const data: ObjectKeys<string> = {
    '100': 'Thin',
    '200': 'Extra light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Bold',
    '700': 'Extra bold',
    '800': 'Heavy'
  };

  return data[type] || type;
};
