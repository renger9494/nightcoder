import { computed, ComputedRef } from '@vue/composition-api';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';
import useBorderEditor from '@/hooks/editor/visual/border.editor.hook';
import useColorEditor from '@/hooks/editor/visual/color.editor.hook';
import useBoxShadowEditor from '@/hooks/editor/visual/boxShadow.editor.hook';

/**
 *
 * @param element - part of user config
 * @param store
 * @param previewMode
 * @returns
 */
export function useFormInputCommonEditorFunctionalityHook(
  element: ComputedRef<any>,
  store: any,
  previewMode: ComputedRef<string>
) {
  const style = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element,
    style,
    store
  };

  const { compiledCssObject: borderCompiledObject } = useBorderEditor(visualHooksParams);
  const { compiledCssObject: borderRadiusCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'borderRadius'
  });
  const { compiledCssObject: fontCompiledObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'font'
  });
  const { compiledCssObject: backgroundColorCompiledObject } = useColorEditor({
    ...visualHooksParams,
    cssProperty: 'background'
  });
  const { compiledCssObject: textColorCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'color'
  });
  const { compiledCssObject: paddingCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'padding'
  });
  const { compiledCssObject: textAlignCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textAlign'
  });
  const { compiledCssObject: textDecorationCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textDecoration'
  });
  const { compiledCssObject: textTransformCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'textTransform'
  });
  const { compiledCssObject: letterSpacingCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'letterSpacing'
  });
  const { compiledCssObject: boxShadowCSSObject } = useBoxShadowEditor({
    ...visualHooksParams
  });
  const { compiledCssObject: heightCSSObject } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'height'
  });

  const computedStyle = computed(() => {
    return {
      ...borderRadiusCompiledObject.value,
      ...borderCompiledObject.value,
      ...fontCompiledObject.value,
      ...textColorCSSObject.value,
      ...paddingCSSObject.value,
      ...backgroundColorCompiledObject.value,
      ...textAlignCSSObject.value,
      ...textDecorationCSSObject.value,
      ...textTransformCSSObject.value,
      ...letterSpacingCSSObject.value,
      ...boxShadowCSSObject.value,
      ...heightCSSObject.value
    };
  });

  return {
    computedStyle
  };
}
