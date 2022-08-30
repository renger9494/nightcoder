import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import ui from './ui';
import project from './project';
import editor from './editor';
import elementTypes from './elementTypes';
import shortcut from './shortcut';
import siteSettings from './siteSettings';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    ui,
    project,
    editor,
    shortcut,
    elementTypes,
    siteSettings
  }
});
