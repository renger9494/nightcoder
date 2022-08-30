/*
 * Хук создания стилей элемента для head страницы со спецификой vdr
 * */
import useInjectStylesPublish from './injectStylesPublish.hook';

export default function useInjectStylesPublishVdr(element: any, hooksToApply?: any) {
  const stylesToHead = useInjectStylesPublish(element, hooksToApply);

  return `.${element.id}{height:100%; width:100%; box-sizing: border-box;} ${stylesToHead}`;
}
