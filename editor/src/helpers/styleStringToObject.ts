import ObjectKeys from "@/utils/types/ObjectKeys";

/**
 * Метод конвертирует входящую строку стилей в объект
 * @styles - стили в виде строки
 */
export default (styles: string) =>
  styles.split(';').reduce((ruleMap: ObjectKeys<string>, ruleString) => {
    const rulePair = ruleString.split(':');
    if (rulePair[0] && rulePair[1]) {
      ruleMap[rulePair[0].trim()] = rulePair[1].trim();
    }
    return ruleMap;
  }, {});
