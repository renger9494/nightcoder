import { sortRoutes } from '@nuxt/utils'

const router = {
  prefetchLinks: false,
  extendRoutes(routes, resolve) {
    routes.push({
      name: 'discover-filter',
      path: '/feed/:categoryName',
      component: resolve(__dirname, 'src/pages/feed/index')
    })
    routes.push({
      name: 'discover-search-projects',
      path: '/s/projects/:textSearch?',
      component: resolve(__dirname, 'src/pages/s/index')
    })
    routes.push({
      name: 'discover-search-users',
      path: '/s/users/:textSearch?',
      component: resolve(__dirname, 'src/pages/s/index')
    })
    routes.push({
      name: 'projects-templates',
      path: '/projects/:projectId/templates',
      component: resolve(__dirname, 'src/pages/templates/index')
    })
    routes.push({
      name: 'templates-search-id',
      path: '/templates/tag/:tagId',
      component: resolve(__dirname, 'src/pages/templates/index')
    })
    routes.push({
      name: 'projects-templates-search-id',
      path: '/projects/:projectId/templates/tag/:tagId',
      component: resolve(__dirname, 'src/pages/templates/index')
    })
    routes.push({
      name: 'projects-template-id',
      path: '/projects/:projectId/templates/:templateId',
      component: resolve(__dirname, 'src/pages/templates/_templateId')
    })

    routes.push({
      path: '/sign-up',
      component: resolve(__dirname, 'src/pages/register')
    })

    routes.push({
      name: 'profiles-user',
      path: '/:alias',
      component: resolve(__dirname, 'src/pages/profiles/_alias')
    })

    routes.push({
      name: 'profiles-user-followers',
      path: '/:alias/followers',
      component: resolve(__dirname, 'src/pages/profiles/_alias')
    })

    routes.push({
      name: 'profiles-user-following',
      path: '/:alias/following',
      component: resolve(__dirname, 'src/pages/profiles/_alias')
    })
    routes.push({
      name: 'dashboard-drafts',
      path: '/dashboard/drafts',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-submissions',
      path: '/dashboard/submissions',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-notifications',
      path: '/dashboard/notifications',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-community',
      path: '/dashboard/community',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-custom',
      path: '/dashboard/custom',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-help',
      path: '/dashboard/help',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-settings',
      path: '/dashboard/settings',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-plans',
      path: '/dashboard/plans',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'dashboard-projects',
      path: '/dashboard/projects/:projectId/pages',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    routes.push({
      name: 'settings-profile',
      path: '/settings/profile',
      component: resolve(__dirname, 'src/pages/dashboard/index')
    })
    sortRoutes(routes)
  },
  scrollBehavior(to, from, savedPosition) {
    if (
      to.name == from.name ||
      (to.name.indexOf('profiles-user') > -1 &&
        from.name.indexOf('profiles-user') > -1 &&
        to.params.alias == from.params.alias) || (to.name == "discover-search-projects" || to.name == "discover-search-users") && (from.name == "discover-search-projects" || from.name == "discover-search-users")
    ) {
      return false
    }
    return { x: 0, y: 0 }
  }
}

export default router
