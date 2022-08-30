import { ImageFile } from '@/helpers/editorUtilities';
import { computed } from '@vue/composition-api';

export default function useClipboardToStore({ store, element }: { store: any; element: any }) {
  if (!element) return;
  element.onpaste = function(event: any) {
    const clipboardData = (<ClipboardEvent>event).clipboardData || (<ClipboardEvent>event.originalEvent).clipboardData;

    if (!clipboardData) return;

    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const image = ImageFile.tryCreate(item);
      if (image != null) {
        store.dispatch('editor/imagePasted', { image });
        continue;
      }

      if (item.kind === 'string' && item.type.match('^text/plain')) {
        item.getAsString(text => {
          store.dispatch('editor/contentPasted', { content: { item, text } });
        });
        continue;
      }
    }
  };

  return {
    clipboard: computed(() => store.editor.clipboard)
  };
}
