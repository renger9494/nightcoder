import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $fAuth: any
    $gAuth: any
  }
}
