import { computed } from '@vue/composition-api';

export default function useKeyPressed({ store, desc, event }: { store: any, desc: string, event: any }) {
  const activeShortcut = computed(() => {
    return store.state.shortcut.activeShortcut;
  });

  return computed(
    () =>
      activeShortcut.value &&
      activeShortcut.value.shortcut &&
      activeShortcut.value.shortcut.desc === desc &&
      activeShortcut.value.shortcut.event === event
  );
}
