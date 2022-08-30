import { computed, ComputedRef } from '@vue/composition-api';
import useBoxShadowEditor from '@/hooks/editor/visual/boxShadow.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export function useVideoElementCommonEditorFunctionality(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<string>
) {
  const styles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: styles,
    store
  };

  const { compiledCssObject: boxShadowCompiledCssObject } = useBoxShadowEditor({
    element: element,
    style: styles,
    store
  });

  const { compiledCssObject: borderRadiusCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'borderRadius'
  });

  const computedStyle = computed(() => {
    return {
      ...boxShadowCompiledCssObject.value,
      ...borderRadiusCompiledObject.value,
      height: '100%',
      width: '100%',
      'box-sizing': 'border-box'
    };
  });

  return {
    computedStyle
  };
}
