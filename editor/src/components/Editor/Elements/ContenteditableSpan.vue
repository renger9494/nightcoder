<template>
  <span
    ref="wrapElement"
    :class="['contenteditable', { touched, touchedEditable: isElementEditing }]"
    @mousedown="onClick"
    @click="onClick"
    @dblclick="onDblClick"
  >
    <span
      ref="spanElement"
      :contenteditable="isContenteditable"
      @keydown="processKeydown"
      @input="throttleChangeElementSize"
      @paste="onPaste"
      @blur="onBlur"
      v-html="data.HTMLText"
    ></span>
  </span>
</template>

<script lang="ts">
import HTMLElementEvent from '@/src/utils/types/HTMLElementEvent';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, defineComponent } from '@vue/composition-api';
import { throttle as _throttle } from 'lodash';

export default defineComponent({
  props: {
    fullValue: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: String,
      default: ''
    },
    isElementNotResizableOnTextChange: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      HTMLText: props.value
    });
    const touched = ref(false);
    const spanElement = ref(null as null | Node);
    const wrapElement = ref(null);

    const isTextEditing = computed(() => {
      return root.$store.state.ui.isTextEditing;
    });

    const isElementEditing = computed(() => {
      return root.$store.getters['editor/elementEditing'](props.fullValue);
    });

    const activeShortcut = computed(() => {
      return root.$store.getters['shortcut/activeShortcut']?.shortcut;
    });

    const selectedElements = computed(() => {
      return root.$store.getters['editor/selectedElement'];
    });

    const isContenteditable = computed(() => {
      return isTextEditing.value && isElementEditing.value;
    });

    //in another way, data.HTMLText will not be changed when user will choose another pages in editor header
    watch(
      () => props.value,
      () => {
        data.HTMLText = props.value;
      }
    );

    watch(
      () => isElementEditing,
      n => {
        if (n.value === false) {
          window.getSelection()?.removeAllRanges();
        }
      },
      { immediate: true }
    );

    watch(activeShortcut, newValue => {
      if (
        newValue &&
        newValue.desc === 'enter' &&
        selectedElements.value?.id === props.fullValue.id &&
        !isElementEditing.value
      ) {
        onDblClick();
      }
    });

    watch(isContenteditable, newValue => {
      if (!newValue) {
        setTimeout(() => {
          window.getSelection()?.removeAllRanges();
          root.$store.commit('ui/changeTextEditing', false);
          root.$store.commit('editor/setEditingElement', undefined);
        });
      }
    });

    onMounted(() => {
      const editorElem = document.querySelector('#editor');
      if (editorElem) {
        editorElem.addEventListener('mousedown', clickOutside);
        editorElem.addEventListener('mouseup', focusOnRangeSelect);
      }
    });

    onBeforeUnmount(() => {
      const editorElem = document.querySelector('#editor');
      if (editorElem) {
        editorElem.removeEventListener('mousedown', clickOutside);
        editorElem.removeEventListener('mouseup', focusOnRangeSelect);
      }
    });

    function addRangeToSpan() {
      if (!spanElement.value) return;
      const range = document.createRange();

      range.setStart(spanElement.value, 0);
      range.setEnd(spanElement.value, spanElement.value.childNodes.length);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      setTimeout(() => {
        (<HTMLSpanElement>spanElement.value)?.focus();
      });
    }

    const ESCAPE_KEYCODE = 27;
    const ENTER_KEYCODE = 13;
    function processKeydown(e: KeyboardEvent) {
      if (e.keyCode === ESCAPE_KEYCODE) {
        touched.value = false;
        if (root.$store.state.ui.isTextEditing) {
          setTimeout(() => {
            window.getSelection()?.removeAllRanges();
            root.$store.commit('ui/changeTextEditing', false);
            root.$store.commit('editor/setEditingElement', undefined);
          });
        }
      }
      if (e.keyCode === ENTER_KEYCODE && props.fullValue.type === 'button') {
        e.preventDefault();
        setTimeout(() => {
          window.getSelection()?.removeAllRanges();
          root.$store.commit('ui/changeTextEditing', false);
          root.$store.commit('editor/setEditingElement', undefined);
        });
      }
    }

    function onDblClick() {
      touched.value = true;
      if (!isElementEditing.value) {
        addRangeToSpan();
      }
      root.$store.commit('ui/changeTextEditing', true);
      root.$store.commit('editor/setEditingElement', props.fullValue);
    }

    function clickOutside(e: any) {
      window.getSelection()?.removeAllRanges();

      if (isContenteditable.value && !e.target.closest(`.vdr_${props.fullValue.id}`)) {
        setTimeout(() => {
          root.$store.commit('ui/changeTextEditing', false);
          root.$store.commit('editor/setEditingElement', undefined);
        });
      }
    }

    function focusOnRangeSelect() {
      if (isContenteditable.value) {
        setTimeout(() => {
          (<HTMLSpanElement>spanElement.value)?.focus();
        });
      }
    }

    function onClick() {
      touched.value = true;
    }

    const throttleChangeElementSize = _throttle(changeElementSize, 50);

    function changeElementSize() {
      if (props.isElementNotResizableOnTextChange) return;
      root.$nextTick(() => {
        const { offsetWidth: w, offsetHeight: h } = <HTMLSpanElement>spanElement.value;
        // console.log('changeElementLocation', { w, h });
        root.$store.commit('editor/changeElementLocation', {
          element: props.fullValue,
          data: { w, h, resizeImmediately: true }
        });
      });
    }

    /**
     * for clearing text from meta information
     */
    function onPaste(event: any) {
      event.preventDefault();
      const text = (event.originalEvent || event).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      emit('processInput', (<HTMLSpanElement>spanElement.value)?.innerText);
      setTimeout(() => {
        const sel = window.getSelection();
        const span = <HTMLSpanElement>spanElement.value;
        if (span && sel) sel.setPosition(span.childNodes[0], span.innerText.length);
      });
    }

    /**
     * Set a value of element
     * Changes happen when @blur is fired
     * Description here: https://forum.vuejs.org/t/strange-behavior-when-using-v-text-vs-v-html-with-contenteditable/18859/4
     */
    function onBlur($event: HTMLElementEvent<HTMLSpanElement>) {
      // console.log('focus out contentspan', $event.target);
      // console.log('focus out contentspan innerHTML', $event.target.innerHTML);
      // console.log('focus out contentspan innerHTML', $event.target.innerText);
      touched.value = false;

      //remove selection range from text field
      window.getSelection()?.removeAllRanges();

      data.HTMLText = $event.target.innerHTML;
      //because innerText has two breaks(\n) instead of one
      emit('processInput', $event.target.innerHTML);
    }

    return {
      onPaste,
      changeElementSize,
      throttleChangeElementSize,
      data,
      touched,
      isTextEditing,
      isElementEditing,
      processKeydown,
      onDblClick,
      clickOutside,
      onBlur,
      onClick,
      spanElement,
      wrapElement,
      isContenteditable
    };
  }
});
</script>

<style lang="scss" scoped>
.contenteditable span[contenteditable='true'] {
  caret-color: black;
  cursor: text;
  outline: none;
  user-select: initial;
  -webkit-user-select: initial;
  -moz-user-select: initial;
}
.contenteditable span {
  outline: none;
  cursor: pointer;

  ::v-deep * {
    font: inherit!important;
    color: inherit!important;
  }
}
.contenteditable,
.contenteditable span {
  font: inherit;
  display: block;
}
</style>
