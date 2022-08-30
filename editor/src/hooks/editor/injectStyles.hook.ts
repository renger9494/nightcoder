import { onBeforeUnmount, onMounted, ref, watch, Ref } from '@vue/composition-api';

/*
 * Хук для создания и внедрения стилей элемента в head страницы
 * TODO разобраться нужен ли он в таком состоянии, когда расчитывает что stylesToHead реактивный
 * */
export default function useInjectStyles(stylesToHead: Ref<string>, watchStylesToHead = false) {
  const styleNode = ref(null as HTMLStyleElement | null);

  const injectIframeStyles = function (styles: string) {
    if (styleNode.value) styleNode.value.parentNode?.removeChild(styleNode.value);

    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(''));
    styleNode.value = style;
    document.head.appendChild(style);
    styleNode.value.textContent = styles;
  };

  onMounted(() => {
    injectIframeStyles(stylesToHead.value);
  });

  onBeforeUnmount(() => {
    if (styleNode.value && styleNode.value.parentNode) styleNode.value.parentNode.removeChild(styleNode.value);
  });

  if (watchStylesToHead) {
    watch(
      stylesToHead,
      () => {
        injectIframeStyles(stylesToHead.value);
      },
      { immediate: true }
    );
  }
}
