import { keys as _keys } from 'lodash';

const state: any = {
  types: {
    StyleElement: { data: [] },
    Block: { data: [] },
    BlockCategory: { data: [] },
    Templates: { data: [] },
    UserFavorites: { data: [] }
  }
};

const getters = {
  /**
   * Получить элементы по условию
   *
   * @param elementType - тип элемента
   * @param condition - функция-предикат должна возвращать boolean
   *
   * getElementsByCondition({elementType:'Templates', condition:function(element){return element.id === 1}})
   * */
  getElementsByCondition(state: any) {
    return ({ elementType, condition }: any) => {
      return state.types[elementType].data.filter((element: any) => {
        return condition(element);
      });
    };
  }
};

export default {
  namespaced: true,
  state,
  getters
};
