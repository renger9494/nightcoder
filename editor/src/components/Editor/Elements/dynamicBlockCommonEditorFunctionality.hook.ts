import { computed, ComputedRef, Ref } from '@vue/composition-api';
import useColorEditor from '@/hooks/editor/visual/color.editor.hook';
import useOverlayEditor from '@/hooks/editor/visual/overlay.editor.hook';
import useCssStyleEditor from '@/hooks/editor/visual/cssStyle.editor.hook';

export function useDynamicBlockCommonEditorFunctionality(element: ComputedRef<any>, store: any, previewMode: Ref<any>) {
  const styles = computed(() => {
    return element.value.styles[previewMode.value];
  });

  const visualHooksParams = {
    element: element,
    style: styles,
    store
  };

  const backgroundColor = computed(() => {
    const { compiledCssObject: backgroundColor } = useColorEditor({
      ...visualHooksParams,
      cssProperty: 'background'
    });

    return {
      ...backgroundColor.value
    };
  });

  const backgroundImage = computed(() => {
    const { compiledCssObject: objectFitCompiledObject } = useCssStyleEditor({
      ...visualHooksParams,
      cssProperty: 'objectFit'
    });
    const { compiledCssObject: opacityCSSObject } = useCssStyleEditor({
      ...visualHooksParams,
      cssProperty: 'opacity'
    });
    const { compiledCssObject: display } = useCssStyleEditor({
      ...visualHooksParams,
      cssProperty: 'displayBackgroundImage'
    });

    return {
      ...objectFitCompiledObject.value,
      ...opacityCSSObject.value,
      display: display.value.displayBackgroundImage
    };
  });

  const backgroundOverlay = computed(() => {
    const { compiledCssObject: overlayCSSObject, isCssPropertyActive: isOverlayActive } = useOverlayEditor({
      ...visualHooksParams
    });
    const { compiledCssObject: displayOverlayCSSObject } = useCssStyleEditor({
      ...visualHooksParams,
      cssProperty: 'displayOverlay'
    });

    return {
      background: isOverlayActive.value ? overlayCSSObject.value.overlay : '',
      display: displayOverlayCSSObject.value.displayOverlay
    };
  });

  const { compiledCssObject: display } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'display'
  });

  const { compiledCssObject: overflow } = useCssStyleEditor({
    ...visualHooksParams,
    cssProperty: 'overflow'
  });

  const blockStyle = computed(() => {
    return {
      position: 'relative',
      display: display.value.display,
      ...(element.value.styles[previewMode.value].heightType === 'fixed'
        ? { height: `${element.value.styles[previewMode.value].height}` }
        : { height: '100vh' })
    };
  });

  return {
    styles,
    blockStyle,
    blockOverflowStyle: computed(() => ({ overflow: overflow.value.overflow })),
    backgroundColor,
    backgroundImage,
    backgroundOverlay
  };
}
