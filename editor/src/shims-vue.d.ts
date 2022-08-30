import Shepherd from 'shepherd.js';

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $shepherd: (...args: any[]) => Shepherd.Tour;
  }
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module "*.svg?inline" {
  const content: any;
  export default content;
}

declare module 'vue-dragscroll';
declare module '@latelier/vue-signalr';
declare module 'v-mask';
declare module 'vue-shepherd';
declare module 'vue-youtube';
// declare module '*';
