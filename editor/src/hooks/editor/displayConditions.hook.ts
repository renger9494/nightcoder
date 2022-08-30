/*
 * Хук для работы с displayConditions
 * TODO стандартизировать использование названий displayConditions
 * */
import ObjectKeys from '@/utils/types/ObjectKeys';
import { computed } from '@vue/composition-api';

type DisplayCondition = {
  id: string;
  condition: string;
  value: string | boolean;
};

export default function useDisplayConditions({
  element,
  conditions,
  store
}: {
  element: any;
  conditions: any[];
  store: any;
}) {
  for (const condition of conditions) {
    if (condition.value !== undefined) {
      setDisplayCondition({
        id: element.value.id,
        condition: condition.condition,
        value: condition.value
      });
    }
  }

  // {"image_d068qe3sq":{ "hideElement" : true, "hideBorder": false }}
  const displayConditions = computed(() => {
    const conditionsObject = {} as ObjectKeys<string>;
    if (!store.state.editor.displayConditions) return conditionsObject;
    conditions.forEach(condition => {
      if (store.state.editor.displayConditions[element.value.id]) {
        conditionsObject[condition.condition] =
          store.state.editor.displayConditions[element.value.id][condition.condition];
      }
    });
    return conditionsObject;
  });

  function setDisplayCondition({ id, condition, value }: DisplayCondition) {
    store.commit('editor/setDisplayCondition', {
      id,
      condition,
      value
    });
  }

  return {
    displayConditions,
    setDisplayCondition
  };
}
