import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import EditorPage from '@/views/pages/editor.vue';

Vue.use(VueRouter);

//Array<RouteConfig>
const routes: Array<any> = [
  {
    path: '/editor/projects/:projectId/pages/:pageId',
    name: 'editor',
    meta: {
      requiresAuth: true,
      layout: 'default',
      title: 'Editor - Edit page'
    },
    component: EditorPage,
    pathToRegexpOptions: { strict: true }
  },
  {
    path: '/editor/blocks/:blockId',
    name: 'editor',
    meta: {
      requiresAuth: true,
      layout: 'default',
      title: 'Editor - Edit block'
    },
    component: EditorPage,
    pathToRegexpOptions: { strict: true }
  },
  {
    path: '/editor/templates/:templateId',
    name: 'editor',
    meta: {
      requiresAuth: true,
      layout: 'default',
      title: 'Editor - Edit template'
    },
    component: EditorPage,
    pathToRegexpOptions: { strict: true }
  },
  {
    path: '/preview/projects/:projectId/pages/:pageId',
    name: 'preview',
    meta: {
      requiresAuth: true,
      layout: 'default',
      title: 'Preview page'
    },
    component: EditorPage,
    pathToRegexpOptions: { strict: true }
  },
  {
    path: '/preview/templates/:templateId',
    name: 'preview',
    meta: {
      requiresAuth: true,
      layout: 'default',
      title: 'Preview template'
    },
    component: EditorPage,
    pathToRegexpOptions: { strict: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  scrollBehavior(to) {
    if (!to.hash) return { x: 0, y: 0 };
  },
  routes
});

export default router;
