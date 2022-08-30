import { computed, onMounted, watch, ref, ComputedRef } from '@vue/composition-api';

import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';
import useBoxShadowEditor from '@/hooks/editor/visual/boxShadow.editor.hook';

import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export default function useEmbedElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<any>
) {
  const previewLocation = computed(() => element.value.location[previewMode.value]);

  const iframe = ref(null as null | HTMLIFrameElement);
  const iframeWidth = computed(() => previewLocation.value.w);
  const iframeHeight = computed(() => previewLocation.value.h);

  function setIFrameContent(content: string) {
    iframe.value?.contentWindow?.document.open();
    iframe.value?.contentWindow?.document.write(
      `<!DOCTYPE html><html style="height: 100%"><head><style>iframe{display:block;}</style></head><body style="margin:0; padding: 0; height: 100%; box-sizing: border-box;">${content}</body></html>`
    );

    iframe.value?.contentWindow?.document.close();
  }

  onMounted(() => {
    setIFrameContent(element.value.payload.code);
  });

  watch(
    () => element.value.payload.code,
    (n, o) => {
      setIFrameContent(n);
    }
  );

  const styles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: styles,
    store
  };

  const { compiledCssObject: borderRadiusCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'borderRadius'
  });

  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });

  const { compiledCssObject: borderCompiledCssObject } = useBorderEditor({
    element: element,
    style: styles,
    store
  });

  const { compiledCssObject: boxShadowCompiledCssObject } = useBoxShadowEditor({
    element: element,
    style: styles,
    store
  });

  const computedStyle = computed(() => {
    return {
      ...borderRadiusCompiledObject.value,
      ...borderCompiledCssObject.value,
      ...boxShadowCompiledCssObject.value,
      ...displayCSSObject.value
    };
  });

  return {
    iframe,
    iframeWidth,
    iframeHeight,
    computedStyle
  };
}
