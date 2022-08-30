const state = {
  // Текущий не обнулённый shortCut(страницы должны сами обнулять
  // шорткат когда закончили его обработку). Можно подписываться на
  // изменение активного шортката и реагировать в компонентах или любой другой части
  // приложения.
  activeShortcut: undefined as any,
  // Все зарегистрированные шорткаты по ним будут генериться вызовы Mousetrap.bind
  // во время загрузки страницы. В коллбеке будет передваться ссылка на
  // мутацию setActiveShortcut в которую будет передаваться строка
  // с описанием шортката "ctrl+d" и дополнительный параметр который
  // можно передавать при регистрации мутации(keyDown и т.д.)
  // такой подход даст возможность управлять шорткатами во время выполнения программы
  // например одному пользователю включать, а другому нет.
  registeredShortcuts: [
    {
      page: 'editor',
      shortcuts: [
        { desc: ['backspace', 'del'], event: 'keydown' },
        { desc: 'esc', event: 'keydown' },
        { desc: 'shift', event: 'keydown' },
        { desc: 'shift', event: 'keyup' },
        { desc: 'alt', event: 'keydown' },
        { desc: 'alt', event: 'keyup' },
        { desc: 'enter', event: 'keydown' },
        { desc: ['ctrl+shift', 'command+shift'], event: 'keydown' },
        { desc: ['ctrl+shift', 'command+shift'], event: 'keyup' },
        { desc: ['shift+ctrl', 'shift+command'], event: 'keydown' },
        { desc: ['shift+ctrl', 'shift+command'], event: 'keyup' },
        { desc: ['ctrl+d', 'command+d'], event: 'keydown' },
        { desc: ['ctrl+z', 'command+z'], event: 'keydown' },
        { desc: ['ctrl+shift+z', 'command+shift+z'], event: 'keydown' },
        { desc: ['ctrl+r', 'command+r'], event: 'keydown' },
        { desc: ['ctrl+alt+down', 'command+option+down'], event: 'keydown' },
        { desc: ['ctrl+alt+up', 'command+option+up'], event: 'keydown' },
        { desc: ['ctrl+shift+b', 'command+shift+b'], event: 'keydown' },
        { desc: ['ctrl+i', 'command+i'], event: 'keydown' },
        { desc: ['ctrl+c', 'command+c'], event: 'keydown' },
        { desc: ['ctrl+x', 'command+x'], event: 'keydown' },
        { desc: ['ctrl+shift+h', 'command+shift+h'], event: 'keydown' },
        { desc: 'up', event: 'keydown' },
        { desc: 'right', event: 'keydown' },
        { desc: 'down', event: 'keydown' },
        { desc: 'left', event: 'keydown' },
        { desc: 'shift+up', event: 'keydown' },
        { desc: 'shift+right', event: 'keydown' },
        { desc: 'shift+down', event: 'keydown' },
        { desc: 'shift+left', event: 'keydown' },
        { desc: 'alt+up', event: 'keydown' },
        { desc: 'alt+right', event: 'keydown' },
        { desc: 'alt+down', event: 'keydown' },
        { desc: 'alt+left', event: 'keydown' },
        { desc: 'alt+shift+up', event: 'keydown' },
        { desc: 'alt+shift+right', event: 'keydown' },
        { desc: 'alt+shift+down', event: 'keydown' },
        { desc: 'alt+shift+left', event: 'keydown' },
        { desc: 'i', event: 'keydown' },
        { desc: 't', event: 'keydown' },
        { desc: 'b', event: 'keydown' },
        { desc: 'r', event: 'keydown' },
        { desc: 'o', event: 'keydown' },
        { desc: 'e', event: 'keydown' },
        { desc: 'f', event: 'keydown' },
        { desc: 'p', event: 'keydown' },
        { desc: 'v', event: 'keydown' },
        { desc: '*', event: 'keyup' }
      ]
    }
  ]
};

const getters = {
  activeShortcut(state: any) {
    return state.activeShortcut;
  },
  activeShortcutTemplate() {
    return {
      page: undefined,
      shortcut: {},
      /**
       * Метки компонентов отработавших по шорткату
       * {comp:"LayersType", status: "done"}
       * */
      marks: []
    };
  }
};

const mutations = {
  setActiveShortcut(state: any, shortcut: any) {
    shortcut.marks = [];
    state.activeShortcut = shortcut;
  },
  setMarkOnActiveShct(state: any, mark: any) {
    state.activeShortcut.marks.push(mark);
  },
  resetShortcut() {
    state.activeShortcut = getters.activeShortcutTemplate();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
