import { computed, ComputedRef } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export function useFormElementCommonEditorFunctionality(
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

  const { compiledCssObject: displayCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });
  const { compiledCssObject: gridAutoFlowCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'gridAutoFlow'
  });
  const { compiledCssObject: gridGapCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'gridGap'
  });
  const { compiledCssObject: gridTemplateRowsCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'gridTemplateRows'
  });

  const computedStyle = computed(() => {
    return {
      ...displayCSSObject.value,
      ...gridAutoFlowCSSObject.value,
      ...gridGapCSSObject.value,
      ...gridTemplateRowsCSSObject.value
    };
  });

  return {
    computedStyle
  };
}
