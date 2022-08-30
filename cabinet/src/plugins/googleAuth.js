import Vue from 'vue'
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: '278325185500-n0kcp1er19f8qn136pkrfcae9q6ijd90.apps.googleusercontent.com',
  scope: 'profile email https://www.googleapis.com/auth/plus.login',
}
Vue.use(GAuth, gauthOption)
