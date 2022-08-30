import { computed, ComputedRef } from '@vue/composition-api';

export default function useOverlay(style: ComputedRef<{ overlay: string }>) {
  /*
   * Хук для создания overlay с помощью :after элемента
   *
   * */
  const css = computed(() => {
    const styleVal = style.value;
    if (styleVal.overlay) {
      return `:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: ${styleVal.overlay};
     }`;
    }
    return '';
  });

  return {
    css
  };
}
