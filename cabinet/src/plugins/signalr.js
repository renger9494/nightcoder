import Vue from 'vue'
import VueSignalR from '@latelier/vue-signalr'

const baseUrl = process.env.BASE_URL.includes('localhost') ? '' : process.env.BASE_URL

Vue.use(VueSignalR, `${baseUrl}/api/hubs/notifications`)
