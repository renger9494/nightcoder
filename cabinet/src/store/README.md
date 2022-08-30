##### Вьюкс стор для shortCut'ов

```js
// Описание Vuex модуля для shortCut's. Пока остановился на Mousetrap
const shortCutVuex = {
  state: {
    // Текущий не обнулённый shortCut(страницы должны сами обнулять
    // шорткат когда закончили его обработку). Можно подписываться на
    // изменение активного шортката и реагировать в компонентах или любой другой части
    // приложения.
    activeShortcut: {
      page: 'design',
      shortcut: { desc: 'ctrl+s', event: 'keyUp' }
    },
    // Все зарегистрированные шорткаты по ним будут генериться вызовы Mousetrap.bind
    // во время загрузки страницы. В коллбеке будет передваться ссылка на
    // мутацию setActiveShortcut в которую будет передаваться строка
    // с описанием шортката "ctrl+d" и дополнительный параметр который
    // можно передавать при регистрации мутации(keyDown и т.д.)
    // такой подход даст возможность управлять шорткатами во время выполнения программы
    // например одному пользователю включать, а другому нет.
    registeredShortCuts: [
      {
        page: 'editor',
        shortcuts: [
          { desc: 'ctrl+d', event: 'keyDown' },
          { desc: 'd', event: 'keyDown' }
        ]
      }
    ]
  },
  getters: {
    activeShortcut(state) {
      return state.activeShortcut;
    }
  },
  mutations: {
    setActiveShortcut() {}
  }
};
```

##### Новый формат state.userConfig.blocks (components)

```js
// Для получения быстрого доступа к элементом, нужно во vuex создать
// getter - который бы возвращал объект вида
const allComponents = {
  block_432g4dsf: Object, //"cсылка на компонент" не может быть undefined
  text_c7lhjigem: Object //"cсылка на компонент" не может быть undefined
};

const userConfig = {
  // Корневой элемент по которому можно найти структуру шаблона,
  // пока есть только два вида компонентов block и element
  components: [
    {
      //id родительского компонента
      parentId: '',
      //Ссылка на родительский компонент
      parentComp: undefined,
      //Уникальный id его же можно использовать для имени класса,
      // для быстрого доступа в DOM если вдруг нужно будет(но это вряд ли)
      id: 'block_432g4dsf',
      //Название
      name: '',
      //Тип компонента(пока block | element)
      type: 'block',
      // Наполнение блока, наполнением могут быть другие блоки или элементы
      bricks: [
        {
          //id родительского компонента
          parentId: 'block_432g4dsf',
          //Ссылка на родительский компонент
          parentComp: 'Здесь ссылка на родительский компонент',
          //Уникальный id его же можно использовать для имени класса,
          // для быстрого доступа в DOM если вдруг нужно будет(но это вряд ли)
          id: 'text_c7lhfsafd',
          //Название
          name: 'Заглавие',
          type: 'element',
          payload: {
            zIndex: 0,
            link: {
              type: 'none',
              url: '',
              openType: 'new'
            },
            //Тип элемента
            type: 'heading',
            content: 'Get busy living or get busy dying.'
          },
          styles: {
            lg: {
              color: '#000000',
              fontFamily: 'Chivo',
              fontSize: 18,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              lineHeight: 28,
              justifyContent: 'flex-start',
              borderRadius: 0,
              textDecoration: 'none',
              textTransform: 'none',
              alignItems: 'flex-start',
              opacity: 1,
              align: 1,
              s: 0,
              h: 28
            },
            laptop: {
              color: '#000000',
              fontFamily: 'Chivo',
              fontSize: 18,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              lineHeight: 28,
              justifyContent: 'flex-start',
              borderRadius: 0,
              textDecoration: 'none',
              textTransform: 'none',
              alignItems: 'flex-start',
              opacity: 1,
              align: 1,
              s: 0
            },
            md: {
              color: '#000000',
              fontFamily: 'Chivo',
              fontSize: 18,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              lineHeight: 28,
              justifyContent: 'flex-start',
              borderRadius: 0,
              textDecoration: 'none',
              textTransform: 'none',
              alignItems: 'flex-start',
              opacity: 1,
              align: 1,
              s: 0
            },
            sm: {
              color: '#000000',
              fontFamily: 'Chivo',
              fontSize: 18,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              lineHeight: 28,
              justifyContent: 'flex-start',
              borderRadius: 0,
              textDecoration: 'none',
              textTransform: 'none',
              alignItems: 'flex-start',
              opacity: 1,
              align: 1,
              s: 0
            }
          }
        },
        { type: 'block' }
      ],
      // Полезная нагрузка элемента(контент, zindex и т.д.)
      payload: {
        zIndex: 0
      },
      styles: {
        lg: {
          height: 1000,
          background: { color: '#FFFFFF', opacity: '1' },
          heightType: 'fixed'
        }
      }
    },
    {
      //id родительского компонента
      parentId: '',
      //Ссылка на родительский компонент
      parentComp: undefined,
      //Уникальный id его же можно использовать для имени класса,
      // для быстрого доступа в DOM если вдруг нужно будет(но это вряд ли)
      id: 'text_c7lhjigem',
      //Название
      name: 'Заглавие 2',
      type: 'element',
      payload: {
        // zIndex вложенных элементов складываются с zIndex родителя
        // умноженного на 100 таким образом в одном блоке может быть до 99 элементов
        //  это обсуждаемо
        zIndex: 0,
        link: {
          type: 'none',
          url: '',
          openType: 'new'
        },
        type: 'heading',
        content: 'Get busy living or get busy dying.'
      },
      styles: {
        lg: {
          color: '#000000',
          fontFamily: 'Chivo',
          fontSize: 18,
          fontWeight: 'normal',
          fontStyle: 'normal',
          letterSpacing: 0,
          lineHeight: 28,
          justifyContent: 'flex-start',
          borderRadius: 0,
          textDecoration: 'none',
          textTransform: 'none',
          alignItems: 'flex-start',
          opacity: 1,
          align: 1,
          s: 0,
          h: 28
        },
        laptop: {
          color: '#000000',
          fontFamily: 'Chivo',
          fontSize: 18,
          fontWeight: 'normal',
          fontStyle: 'normal',
          letterSpacing: 0,
          lineHeight: 28,
          justifyContent: 'flex-start',
          borderRadius: 0,
          textDecoration: 'none',
          textTransform: 'none',
          alignItems: 'flex-start',
          opacity: 1,
          align: 1,
          s: 0
        },
        md: {
          color: '#000000',
          fontFamily: 'Chivo',
          fontSize: 18,
          fontWeight: 'normal',
          fontStyle: 'normal',
          letterSpacing: 0,
          lineHeight: 28,
          justifyContent: 'flex-start',
          borderRadius: 0,
          textDecoration: 'none',
          textTransform: 'none',
          alignItems: 'flex-start',
          opacity: 1,
          align: 1,
          s: 0
        },
        sm: {
          color: '#000000',
          fontFamily: 'Chivo',
          fontSize: 18,
          fontWeight: 'normal',
          fontStyle: 'normal',
          letterSpacing: 0,
          lineHeight: 28,
          justifyContent: 'flex-start',
          borderRadius: 0,
          textDecoration: 'none',
          textTransform: 'none',
          alignItems: 'flex-start',
          opacity: 1,
          align: 1,
          s: 0
        }
      }
    }
  ]
};
```

####state.userConfig

Пример конфига с комментариями

```js
  // Корневой элемент
  root: {
    // Обёртка
    wrapper: {
      image: { src: null, active: false },
      bgColor: "#FBFBFB",
      textColor: { dark: "color: #000000;", light: "color: #FFFFFF;" },
    },
    // Ширина контейнера
    containerWidth: 1100,
    // Позиционирование контейнера
    containerPosition: "unset",
  },
  // Блоки в контейнере их может быть много они будут отличаться ключами,
  // на первом уровне объекта blocks ничего кроме блоков быть не должно
  blocks: {
    // Первый блок
    block1: {
      // Метаданные, class - уникальный класс блока на странице
      meta: { id: 1, name: "Empty Block", class: "block_v5lmwcy2q" },
      // Стили для разных платформ
      styles: {
        lg: {
          h: 1000,
          background: { color: "#FFFFFF", opacity: "1" },
          heightType: "fixed",
        },
        md: {
          h: 600,
          background: { color: "#FFFFFF", opacity: "1" },
          heightType: "fixed",
        },
        sm: {
          h: 400,
          background: { color: "#FFFFFF", opacity: "1" },
          heightType: "fixed",
        },
        laptop: {
          h: 800,
          background: { color: "#FFFFFF", opacity: "1" },
          heightType: "fixed",
        },
      },
      // Элементы блока
      elements: [
        {
          // Тип элемента
          element: "text",
          // Ключ по которому хранятся данные по элементу.
          // Ключ всегда равен element этого блока
          text: {
            // Уникальный идентификатор элемента на странице
            id: "text_z3ynk7zf0",
            // Z-index элемента внутри блока
            zIndex: 0,
            // Отображаемое имя блока
            name:"text"
            // специфические для блока данные?
            link: { type: "none", url: "", openType: "new" },
            style: {
              lg: {
                color: "#000000",
                fontFamily: "Chivo",
                fontSize: 18,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                lineHeight: 28,
                justifyContent: "flex-start",
                borderRadius: 0,
                textDecoration: "none",
                textTransform: "none",
                alignItems: "flex-start",
                opacity: 1,
                align: 1,
                s: 0,
              },
              laptop: {
                color: "#000000",
                fontFamily: "Chivo",
                fontSize: 18,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                lineHeight: 28,
                justifyContent: "flex-start",
                borderRadius: 0,
                textDecoration: "none",
                textTransform: "none",
                alignItems: "flex-start",
                opacity: 1,
                align: 1,
                s: 0,
              },
              md: {
                color: "#000000",
                fontFamily: "Chivo",
                fontSize: 18,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                lineHeight: 28,
                justifyContent: "flex-start",
                borderRadius: 0,
                textDecoration: "none",
                textTransform: "none",
                alignItems: "flex-start",
                opacity: 1,
                align: 1,
                s: 0,
              },
              sm: {
                color: "#000000",
                fontFamily: "Chivo",
                fontSize: 18,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                lineHeight: 28,
                justifyContent: "flex-start",
                borderRadius: 0,
                textDecoration: "none",
                textTransform: "none",
                alignItems: "flex-start",
                opacity: 1,
                align: 1,
                s: 0,
              },
            },
            type: "heading",
            content:
              "I’m a success today because I had a friend who believed in me and I didn’t have the heart to let him down.",
          },
          // Расположение блока на разных платформах
          location: {
            lg: {
              y: 528,
              x: 701,
              w: 884,
              h: 28,
              a: 0,
              textBoxStyle: "autowidth",
              axisAlign: null,
              svgBorder: null,
            },
            laptop: {
              y: 528,
              x: 701,
              w: 200,
              h: 100,
              a: 0,
              textBoxStyle: "autowidth",
              axisAlign: null,
              svgBorder: null,
            },
            md: {
              y: 528,
              x: 701,
              w: 200,
              h: 100,
              a: 0,
              textBoxStyle: "autowidth",
              axisAlign: null,
              svgBorder: null,
            },
            sm: {
              y: 528,
              x: 701,
              w: 200,
              h: 100,
              a: 0,
              textBoxStyle: "autowidth",
              axisAlign: null,
              svgBorder: null,
            },
          },
        }
      ],
    },
  },
  // Оформление страницы или шаблона?
  branding: { theme: "black", position: "br" },
  // Настройки
  settings: {
    title: "test",
    //?
    hotjarId: null,
    // Является ли стартовой?
    isNoIndex: false,
    description: "custom template",
    //?
    socialImage: {
      id: "0f5ad587-2d08-4029-8422-b464b3e02fee",
      path: "https://s3.amazonaws.com/beta.airtap.io/Defaults/share+image.png",
      fullPath:
        "https://s3.amazonaws.com/beta.airtap.io/Defaults/share+image.png",
      originalFileName: "share image.png",
    },
    // Домен в airtap
    airtapDomain: "test1290",
    // Выбранный домен?
    customDomain: null,
    faviconImage: {
      id: "dad37fe5-42d7-42d8-b3c2-25810ad10187",
      path: "https://s3.amazonaws.com/beta.airtap.io/Defaults/256.png",
      fullPath:
        "https://s3.amazonaws.com/beta.airtap.io/Defaults/256.png",
      originalFileName: "favicon.png",
    },
    shortUrlLink: null,
    isAirtapBranding: false,
    googleAnalyticsId: null,
    googleTagManagerId: null,
  },
  template: "custom",
  fontStyle: "geek",
  projectId: "1290",
  colorStyle: "gradient-ocean",
  googleFonts: { fonts: ["Chivo:400,700,900"] },
  faviconImage: {
    id: "dad37fe5-42d7-42d8-b3c2-25810ad10187",
    path: "https://s3.amazonaws.com/beta.airtap.io/Defaults/256.png",
    fullPath:
      "https://s3.amazonaws.com/beta.airtap.io/Defaults/256.png",
    originalFileName: "favicon.png",
  }
}
```
