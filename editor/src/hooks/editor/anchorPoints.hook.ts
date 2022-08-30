import { Point } from '@/helpers/AnchorPoints';
import { ElementLocation } from '@/store/elements/changeLocation';
import { computed, onMounted, watch, ComputedRef } from '@vue/composition-api';

/**
 * Хук для создания или регистрации вычисляемых anchor points
 *  @parameter element - элемент который регистрирует свои aps
 *  @parameter store - инстанс store мутации из которого используются в хуке
 *  @parameter [anchorPoints] - computed отличные от стандартных aps, переданные из элемента
 */
function useAnchorPoints({
  element,
  store,
  anchorPoints
}: {
  element: any;
  store: any;
  anchorPoints: ComputedRef<Point[]>;
}) {
  watchAnchorPoints(element, store, anchorPoints);
}
/**
 * Хук для создания или регистрации вычисляемых anchor points
 *  @parameter element - элемент который регистрирует свои aps
 *  @parameter store - инстанс store мутации из которого используются в хуке
 *  @parameter [location] - текущее значение свойства location элемента в массиве styles,
 */
function useAnchorPointsByLocation({
  element,
  store,
  location
}: {
  element: any;
  store: any;
  location: ComputedRef<ElementLocation>;
}) {
  const watchedAnchorPoints = computed(() => {
    const { x, y, w, h } = location.value;
    return [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
      { x: x + Math.round(w / 2), y: y },
      { x: x + Math.round(w / 2), y: y + h },
      { x: x, y: y + Math.round(h / 2) },
      { x: x + w, y: y + Math.round(h / 2) },
      { x: x + Math.round(w / 2), y: y + h },
      { x: x + Math.round(w / 2), y: y + Math.round(h / 2) }
    ];
  });

  watchAnchorPoints(element, store, watchedAnchorPoints);
}

function watchAnchorPoints(element: any, store: any, watchedAnchorPoints: ComputedRef<Point[]>) {
  watch(
    watchedAnchorPoints,
    newVal => {
      setAPs(newVal);
    },
    { immediate: true }
  );

  function setAPs(aps: Point[]) {
    store.commit('editor/deleteAPs', {
      id: element.id,
      parentId: element.parentId
    });
    store.commit('editor/setAPs', {
      id: element.id,
      aps
    });
  }

  onMounted(() => {
    setAPs(watchedAnchorPoints.value);
  });
}

export { useAnchorPoints, useAnchorPointsByLocation };
